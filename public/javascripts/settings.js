document.addEventListener("DOMContentLoaded", function () {
  const checkLnk = (u, s) => {
    return (
      u.lastIndexOf(s) == u.length - s.length ||
      u.lastIndexOf(s) == u.length - s.length - 1
    );
  };
  const getProjLink = () => {
    proj_root_link = location.href;
    if (checkLnk(proj_root_link, "/settings"))
      proj_root_link = proj_root_link.slice(0, proj_root_link.length - 9);
    if (!checkLnk(proj_root_link, "/")) proj_root_link += "/";
    return proj_root_link;
  };
  const setDirLink = () => {
    document.querySelector(".director-links").innerHTML =
      "Director - " +
      '<a href="' +
      director_link +
      '" target="_blank" rel="noopener noreferrer">' +
      director_link +
      "</a>";
  };

  const project_name = document.querySelector(".name_input");
  const project_result = document.querySelector(".name_result");
  const cameras = document.querySelector(".nums_input");
  let title = "",
    cams = 0,
    title_old = "";
  let proj_root_link = "",
    director_link = "";

  getProjLink();
  director_link = proj_root_link + "director";
  setDirLink();

  const air = document.querySelector("#air");
  air.addEventListener("click", (e)=>{
    // do you really want?

    const live_checked = !(e.target.getAttribute('aria-checked') === 'true');
    // send event
    send("live", live_checked);
  })

  const inputHandler = function (e) {
    title = slugify(e.target.value);
    if (title != e.target.value)
      project_result.innerText = title; // "Actual title: " +
    else project_result.innerText = "";
  };
  project_name.addEventListener("input", inputHandler);
  project_name.addEventListener("propertychange", inputHandler);

  const settings_form = document.querySelector("#settings_form");
  let cams_list = [];
  const saveSettings = function (e) {
    if (title != title_old) send("title", title);

    let cams_temp = parseInt(cameras.value);
    if ((cams_temp || cams_temp === 0) && cams_temp != cams) {
      if (cams_temp >= 0 && cams_temp <= 255) send("quantity", cams_temp);
    }
  };
  settings_form.addEventListener("submit", saveSettings);

  const copyToClipboard = function (e) {
    // add some notification !!!
    navigator.clipboard.writeText(e.target.parentElement.innerText); //.replace(/<\/?[a-zA-Z]+>/gi, ""));
    console.log("Copied!");
  };
  document
    .querySelectorAll(".clipboard")
    .forEach((button_copy) =>
      button_copy.addEventListener("click", copyToClipboard)
    );

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
              temp_link = proj_root_link;
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
        break;
      case "wrong":
        error.innerText = value;
        break;
      case "offline":
        console.log("offline");
        error.innerText = "Saving error. You are offline!";
        break;
      case "live":
        if (value) {
          let temp_date = new Date();
          let temp_minutes = parseInt(value/60);
          temp_date.setUTCHours((parseInt(temp_minutes/60)+3)%24);
          temp_date.setUTCMinutes(temp_minutes%60);
          air.setAttribute('data-finish', temp_date.toLocaleTimeString().slice(0,-3));
        }
        air.setAttribute('aria-checked', String(!!value));
        break;
      default:
        console.log(key, value);
        break;
    }
  };
});
