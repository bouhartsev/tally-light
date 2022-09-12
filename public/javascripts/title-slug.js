const project_name = document.querySelector(".name_input");
const project_result = document.querySelector(".name_result");
let title = "";

const inputHandler = function (e) {
  title = slugify(e.target.value);
  if (title != e.target.value)
    project_result.innerText = title; // "Actual title: " +
  else project_result.innerText = "";
};
project_name.addEventListener("input", inputHandler);
project_name.addEventListener("propertychange", inputHandler);

function replaceTitle() {
    project_name.value = title
}