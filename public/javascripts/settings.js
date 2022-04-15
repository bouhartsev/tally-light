document.addEventListener("DOMContentLoaded", function () {
  // function generateSlug(value) {
  //   return (
  //     value
  //       .toLowerCase() // convert to lowercase
  //       // .replace(/-+/g, "") // remove dashes and pluses
  //       .replace(/\s+/g, "-") // replace spaces with dashes
  //       .replace(/[^a-z0-9-]/g, "") // remove everything but alphanumeric characters and dashes
  //   );
  // }




  // Make ready to both versions (new AND settings) or make new file
  // hide cameras when null.


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

  const button_save = document.querySelector("#save");
  let cams_list = [],
    cams_list_to_copy = "";
  const saveSettings = function (e) {
    if (title != title_old) send("title", title);

    let cams_temp = parseInt(cameras.value);
    if ((cams_temp || cams_temp === 0) && cams_temp != cams) {
      if (cams_temp >= 0 && cams_temp <= 255) send("quantity", cams_temp);
    }
  };
  button_save.addEventListener("click", saveSettings);

  const button_copy = document.querySelector(".clipboard");
  const copyToClipboard = function (e) {
    navigator.clipboard.writeText(cams_list_to_copy);
    console.log("Copied!");
  };
  button_copy.addEventListener("click", copyToClipboard);

  addition = document.querySelector(".status");
  const warning = document.querySelector(".warning");
  const cameras_crew_links = document.querySelector(".cameras_crew-links");
  setData = function (key, value) {
    warning.innerText = "";
    switch (key) {
      case "title":
        if (title_old != value) title, title_old, (project_name.value = value);
        break;
      case "quantity":
        cams = parseInt(value);
        cameras.value = value;
        if (cams_list.length != value) {
          if (cams_list.length > value) cams_list.splice(value, cams_list.length - value)
          else if (cams_list.length < value) {
            let newCam = null;
			let temp_link="";
            while (cams_list.length != value) {
              newCam = document.createElement("li");
              newCam.id = cams_list.length+1;
			  temp_link = location.href;
              newCam.innerHTML = "Camera "+newCam.id+" - "+'<a href="'+temp_link+'" target="_blank" rel="noopener noreferrer">'+temp_link+'</a>';
              cams_list.push(newCam);
            }
          }
          cameras_crew_links.replaceChildren(...cams_list);
        }

        cams_list_to_copy = cameras_crew_links.innerHTML; //.replace(/<\/?[a-zA-Z]+>/gi, "")
        break;
      case "offline":
        console.log("offline");
        warning.innerText = "Saving error. You are offline!";
        break;
      default:
        console.log(key, value);
        break;
    }
  };
});
