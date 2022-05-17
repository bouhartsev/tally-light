document.addEventListener("DOMContentLoaded", function () {

  const project_name = document.querySelector(".name_input");
  const project_result = document.querySelector(".name_result");
  const cameras = document.querySelector(".nums_input");
  let title = "",
    cams = 0,
    title_old = "";

  const inputHandler = function (e) {
    title = slugify(e.target.value);
    if (title != e.target.value)
      project_result.innerText = "Actual title: " + title;
    else project_result.innerText = "";
  };
  project_name.addEventListener("input", inputHandler);
  project_name.addEventListener("propertychange", inputHandler);

  const settings_form = document.querySelector("#settings_form");
  let cams_list = [],
    cams_list_to_copy = "";
  const saveSettings = function (e) {
    if (title != title_old) send("title", title);

    let cams_temp = parseInt(cameras.value);
    if ((cams_temp || cams_temp === 0) && cams_temp != cams) {
      if (cams_temp >= 0 && cams_temp <= 255) send("quantity", cams_temp);
    }
  };
  settings_form.addEventListener("submit", saveSettings);

  const button_copy = document.querySelector(".clipboard");
  const copyToClipboard = function (e) {
    navigator.clipboard.writeText(cams_list_to_copy);
    console.log("Copied!");
  };
  button_copy.addEventListener("click", copyToClipboard);

  addition = document.querySelector(".status");
  const error = document.querySelector(".error");
  const cameras_crew_links = document.querySelector(".cameras_crew-links");
  setData = function (key, value) {
    // if (error.innerText) error.innerText = ""; // how to remove error ???
    switch (key) {
      case "title":
        if (title_old != value) title = title_old = project_name.value = value;
        break;
      case "quantity":
        cams = parseInt(value);
        cameras.value = value;
        if (cams_list.length != value) {
          if (cams_list.length > value)
            cams_list.splice(value, cams_list.length - value);
          else if (cams_list.length < value) {
            let newCam = null;
            let temp_link = "";
            while (cams_list.length != value) {
              newCam = document.createElement("li");
              newCam.id = cams_list.length + 1;
              temp_link = location.href;
              if (checkStr(temp_link, "/settings")) temp_link = temp_link.slice(0, temp_link.length-9);
              if (!checkStr(temp_link, "/")) temp_link += '/';
              temp_link += newCam.id;
              newCam.innerHTML =
                "Camera " +
                newCam.id +
                " - " +
                '<a href="' +
                temp_link +
                '" target="_blank" rel="noopener noreferrer">' +
                temp_link +
                "</a>";
              cams_list.push(newCam);
            }
          }
          cameras_crew_links.replaceChildren(...cams_list);
        }

        cams_list_to_copy = cameras_crew_links.innerText; //.replace(/<\/?[a-zA-Z]+>/gi, "")
        break;
      case "wrong":
        error.innerText = value;
        break;
      case "offline":
        console.log("offline");
        error.innerText = "Saving error. You are offline!";
        break;
      default:
        console.log(key, value);
        break;
    }
  };

  const checkStr = (u, s) => {
    return (u.lastIndexOf(s)==(u.length-s.length) || u.lastIndexOf(s)==(u.length-s.length-1));
  }
});
