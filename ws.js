module.exports = function (server) {
    const { v4 } = require('uuid');
    const uuid = v4;

    const { Server } = require('ws');
    const wss = new Server({ server });

    var clients = {};

    function send(client, message) {
        if (typeof(message) == 'string') message = {'status':message};
        client.send(JSON.stringify(message));
    }

    wss.on('connection', function (ws, req) {
        ws.id = uuid();
        let url_arr = req.url.split("/").filter((val) => val);
        let id = url_arr[0];
        console.log("New WS connection: " + id);
        if (!(id in clients)) clients[id] = {'directors':[], 'cameras':{}, 'quantity':0, 'preview':null, 'onair':null};

        let number = -2; // -2 - not exists, -1 - director, >0 - number of camera, 0 - reserved for camera used
        if (url_arr.length==1) {
            number = -1;
        }
        else if (url_arr.length>1) {
            num = parseInt(url_arr[1]);
            if (Number.isInteger(num)) {
                if (num>0 && num<=clients[id]['quantity']) {
                    number = num;
                }
            }
        }

        // add director
        if (number==-1) {
            clients[id]['directors'].push(ws);
            send(ws,{'quantity':clients[id]['quantity'], 'preview':clients[id]['preview'], 'onair':clients[id]['onair']});
            for (let key in clients[id]['cameras']) {
                if (clients[id]['cameras'][key].length) send(ws, {'connected':key});
            }
        }
        // add camera
        else if (number>0) {
            if (!(number in clients[id]['cameras']))  {
                clients[id]['cameras'][number]=[];
            }
            // send message to directors
            for (let i=0; i<clients[id]['directors'].length && !clients[id]['cameras'][number].length; i++) {
                send(clients[id]['directors'][i], {'connected':number});
            }
            clients[id]['cameras'][number].push(ws);
            if (number==clients[id]['onair']) send(ws, 'onair');
            if (number==clients[id]['preview']) send(ws, 'preview');
        }
        else {
            // send - ?
            ws.close(4000, 'not exist');
        }


        ws.on('message', function (message) {
            console.log('Message ' + message);
            message = JSON.parse(message);

            for (let i=0; i<clients[id]['directors'].length; i++) {
                send(clients[id]['directors'][i], message);
            }
            // удалять камеры при изменении количества на сайте, удалять данные из preview и onair, отсоединять людей
            for (let key in message) {
                let value = message[key];

                // Нужно ли проверять ключ и значение, а также на null - ?
                
                if (key=="quantity" && value<clients[id][key]) {
                    Object.keys(clients[id]["cameras"]).filter(item => item>value).forEach(cam_key => {
                        clients[id]["cameras"][cam_key].forEach(el => {
                            el.close(4000, "not exist");
                        });
                    });
                    if (clients[id]["preview"]>value) clients[id]["preview"] = null;
                    if (clients[id]["onair"]>value) clients[id]["onair"]=null;
                }
                else { // if (key!="quantity")
                    if (value in clients[id]['cameras']) {
                        for (let i=0; i<clients[id]['cameras'][value].length; i++) {
                            send(clients[id]['cameras'][value][i], key);
                        }
                    }
                    if (((key=="preview"&&clients[id]["onair"]!=clients[id][key]) || key=="onair") && clients[id][key]!=null && (clients[id][key] in clients[id]['cameras'])) {
                        for (let i=0; i<clients[id]['cameras'][clients[id][key]].length; i++) {
                            send(clients[id]['cameras'][clients[id][key]][i], "connected");
                        }
                    }
                }

                clients[id][key] = value;
            }
        });

        ws.on('close', function (code) {
            console.log('Close WS connetion: ' + id + ", " + number);
            if (number==-1)
                clients[id]['directors'] = clients[id]['directors'].filter(item => JSON.stringify(item)!=JSON.stringify(ws));
            else if (number>0) {
                // console.log(ws);
                clients[id]['cameras'][number] = clients[id]['cameras'][number].filter(item => item.id!=ws.id);
                // send message to directors
                for (let i=0; i<clients[id]['directors'].length && !clients[id]['cameras'][number].length && code!=4000; i++) {
                    send(clients[id]['directors'][i], {'disconnected':number});
                }
            }
        });

    });

    return wss;
};