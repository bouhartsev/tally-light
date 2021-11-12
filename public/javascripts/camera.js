document.addEventListener("DOMContentLoaded", function () {
    addition = document.querySelector("h1>span");
    let description = document.querySelector("h2");

    // add from url to html
    let number = location.pathname.split('/');
    number = number[2];
    if (parseInt(number)) number = parseInt(number);
    // addition.innerText = number; // теперь в роутере

    setData = function (key, value) {
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
                console.log(key, value);
                break;
        }
    }
    

    // offline (is disconnected - разорвано соединение - или doesn't exist - не существует), connected, preview, onair
});