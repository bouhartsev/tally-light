let HOST = location.href.replace(/^http/, 'ws')
let ws = new WebSocket(HOST);

let addition = null;

let setData = function(key, value) {return}

let send = function(key, value) {
    // if (ws.bufferedAmount == 0) // нужно ли?
    ws.send(JSON.stringify({[key]: value}));
}

ws.onmessage = function(event) {
    let mes = JSON.parse(event.data);
    for (let key in mes) {
        setData(key, mes[key]);
    }
};

ws.onclose = function(event){
    if (event.code==4000) addition.classList.add("not-exist");
    else addition.classList.add("disconnected");
    setData("status", "offline");
}
ws.onopen = function(event) {
    addition.classList.remove("not-exist");
    addition.classList.remove("disconnected");
    document.querySelector(".loading").classList.remove("loading");
    setData("status", "connected");
}