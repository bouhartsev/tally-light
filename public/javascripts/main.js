// document.addEventListener("DOMContentLoaded", function() {
let HOST = location.href.replace(/^http/, 'ws')
let ws = new WebSocket(HOST);

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
// });