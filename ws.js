module.exports = function (server) {
    const { Server } = require('ws');
    const wss = new Server({ server });

    var clients = {};

    function send(client, message) {
        client.send(JSON.stringify(message));
    }

    wss.on('connection', function (ws, req) {
        let url_arr = req.url.split("/").filter((val) => val);
        let id = url_arr[0];
        console.log("New WS connection: " + id);
        if (!(id in clients)) clients[id] = {'directors':[], 'cameras':{}, 'quantity':0, 'preview':null, 'onair':null};

        let number = -2; // -2 - not exists, -1 - director, >0 - number of camera, 0 - reserved for camera used
        if (url_arr.length==1) {
            number = -1;
        }
        else if (url_arr.length>1) {
            if (Number.isInteger(url_arr[1])) {
                num = Number(url_arr[1]);
                if (num>0 && num<=clients[id]['quantity']) {
                    number = num;
                }
            }
        }

        // add director
        if (number==-1) {
            clients[id]['directors'].push(ws);
            send(ws,{'quantity':clients[id]['quantity'], 'preview':clients[id]['preview'], 'onair':clients[id]['onair']});
        }
        // add camera
        else if (number>0) {
            if (!(number in clients[id]['cameras'][number])) clients[id]['cameras'][number]=[];
            clients[id]['cameras'][number].push(ws);
            if (number==clients[id]['preview']) send(ws, 'preview');
            if (number==clients[id]['onair']) send(ws, 'onair');
        }
        else {
            ws.close(4000, 'not exists');
        }


        ws.on('message', function (message) {
            console.log('Message ' + message);
            message = JSON.parse(message);

            for (let i=0; i<clients[id]['directors'].length; i++) {
                send(clients[id]['directors'][i], message);
            }
            if (message[0]!="quantity") {
                for (let i=0; i<clients[id]['cameras'][message[1]]; i++) {
                    send(clients[id]['cameras'][message[1]][i], message[0]);
                }
            }
            // удалять камеры при изменении количества на сайте, удалять данные из preview и onair, отсоединять людей
            for (let key in message) {
                // check value!
                clients[id][key] = message[key];
            }
        });

        ws.on('close', function () {
            console.log('Close WS connetion: ' + id + ", " + number);
            if (number==-1)
                clients[id]['directors'] = clients[id]['directors'].filter(item => JSON.stringify(item)!=JSON.stringify(ws));
            else if (number>0)
                clients[id]['cameras'] = clients[id]['cameras'][number].filter(item => JSON.stringify(item)!=JSON.stringify(ws));
        });

    });

    return wss;
};