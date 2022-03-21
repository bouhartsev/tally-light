let HOST = location.href.replace(/^http/, 'ws')
// let ws = new WebSocket(HOST);
let ws = io();

let addition = null;

let setData = function(key, value) {return}

let send = function(key, value) {
    // if (ws.bufferedAmount == 0) // нужно ли?
    ws.emit("message",JSON.stringify({[key]: value}));
}

ws.on('message', function(data) {
    let mes = JSON.parse(data);
    for (let key in mes) {
        setData(key, mes[key]); // if key!='change_title'
    }
}
);

ws.on('disconnect', function(reason){
    if (reason=="io server disconnect") addition?.classList.add("not-exist");
    else addition?.classList.add("disconnected");
    setData("status", "offline");
}
);

ws.on('connect', function(event) {
    addition?.classList.remove("not-exist");
    addition?.classList.remove("disconnected");
    document.querySelector(".loading")?.classList.remove("loading");
    setData("status", "connected");
}
);