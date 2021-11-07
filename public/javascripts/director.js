document.addEventListener("DOMContentLoaded", function() {
    let cams = 0;
    
    function addClick(button) {
        button.addEventListener('click', function(event) {
            let cam = parseInt(event.srcElement.id);
            if (!event.srcElement.classList.contains("onair")) {
                if (event.srcElement.classList.contains("preview")) send("onair", cam);
                else send("preview", cam);
            }
        });
    }

    document.querySelectorAll(".camera").forEach(addClick);

    document.querySelector("#change").addEventListener('click', function(event) {
        let cams_temp = parseInt(document.querySelector("input").value);
        if ((cams_temp || cams_temp===0) && cams_temp!=cams) send("quantity", cams_temp);
    });

    document.querySelector("#reset").addEventListener('click', function(event) {
        send("preview", null);
        send("onair", null);
    });

    setData = function (key, value) {
        if (key=="quantity") {
            if (value!=cams) {
                document.querySelector("input").value = value;
                
                if (cams>value) {
                    while(cams!=value) {
                        document.getElementById(cams).remove();
                        cams--;
                    }
                }
                else if (cams<value) {
                    let newCams = [];
                    let newCam = null;
                    while(cams!=value) {
                        cams++;
                        newCam = document.createElement('button');
                        newCam.classList.add("camera");
                        newCam.id = cams;
                        newCam.innerText = cams;
                        addClick(newCam);
                        newCams.push(newCam);
                    }
                    document.querySelector(".cameras").append(...newCams);
                }
            }
        }
        else if (key=="preview" || key=="onair") {
            document.querySelectorAll(".camera").forEach(function(button) {
                button.classList.remove(key);
            });
            if (value!=null) document.getElementById(value).classList.add(key);
        }
        else {
            console.log(key, value);
        }
    }
});