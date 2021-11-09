document.addEventListener("DOMContentLoaded", function () {
    let addition = document.querySelector("h1>span");
    let description = document.querySelector("h2");

    // add from url to html
    let number = location.pathname.split('/');
    number = number[number.length-1];
    if (parseInt(number)) number = parseInt(number);
    addition.innerText = number;

    setData = function (key, value) {
        console.log(key, value);
        switch (value) {
            case 'preview':
            case 'onair':
                document.body.classList.add(value);
                description.innerText = '';
                break;
            default: // connected
                document.body.classList.remove("preview");
                document.body.classList.remove("onair");
                description.innerText = value;
                break;
        }
    }
    ws.onclose = function(event){
        if (event.code==4000) addition.classList.add("not-exist");
        else addition.classList.add("disconnected");
        setData("status", "offline");
    }
    ws.onopen = function(event) {
        addition.classList.remove("not-exist");
        addition.classList.remove("disconnected");
        setData("status", "connected");
    }

    // offline (is disconnected - разорвано соединение - или doesn't exist - не существует), connected, preview, onair
});