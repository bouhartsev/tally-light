let HOST = location.href.replace(/^http/, 'ws')
// let ws = new WebSocket(HOST);
let ws = io();

let addition = null;
let toSend = null;

let redirect = function(title) {
    location.pathname = location.pathname.replace(/^\/\w+/, '/'+title);
}

let setData = function(key, value) {return}

let send = function(key, value) {
    // if (ws.bufferedAmount == 0) // нужно ли?
    if (typeof key == "object") toSend = key;
    else toSend = {[key]: value};
    ws.emit("message",JSON.stringify(toSend));
}

ws.on('message', function(data) {
    let mes = JSON.parse(data);
    for (let key in mes) {
        if (key!='change_title')
            setData(key, mes[key]);
        else redirect(mes[key]);
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