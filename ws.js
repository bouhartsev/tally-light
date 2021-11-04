module.exports = function (server) {
    const { Server } = require('ws');
    const wss = new Server({ server });

    var clients = {};

    function send(client, message) {
        client.send(JSON.stringify(message));
    }

    wss.on('connection', function (ws, req) {

        url_arr = req.url.split("/").filter((val) => val);
        var id = url_arr[0];
        console.log("New WS connection: " + id);
        if (!(id in clients)) clients[id] = {'directors':[], 'cameras':{}, 'quantity':0, 'preview':null, 'onair':null};
        else {
            console.log(clients[id]);
        }
        if (url_arr.length==1) {
            clients[id]['directors'].push(ws);
            send(ws,{'quantity':clients[id]['quantity'], 'preview':clients[id]['preview'], 'onair':clients[id]['onair']});
        }
        else if (url_arr.length>1) {
            if (Number.isInteger(url_arr[1])) {
                num = Number(url_arr[1]);
                if (num>0 && num<=clients[id]['quantity']) {
                    if (!(num in clients[id]['cameras'][num])) clients[id]['cameras'][num]=[];
                    clients[id]['cameras'][num].push(ws);
                    if (num==clients[id]['preview']) send(ws, 'preview');
                    if (num==clients[id]['onair']) send(ws, 'onair');
                }
                else ws.close(4000, 'not exists');
            }
            else {
                ws.close(4000, 'not exists');
            }
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
            for (let key in message) {
                // check value!
                clients[id][key] = message[key];
            }
        });

        ws.on('close', function () {
            console.log('Close WS connetion: ' + id);
            // delete clients[id];
            // delete clients from cameras to !
        });

    });

    return wss;
};