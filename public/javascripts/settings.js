function generateSlug(value) {
  // 1) convert to lowercase
  // 2) remove dashes and pluses
  // 3) replace spaces with dashes
  // 4) remove everything but alphanumeric characters and dashes
  return value
    .toLowerCase()
    .replace(/-+/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// const project_name = document.querySelector(".name_input");
// const project_result = document.querySelector('.name_result');
// const inputHandler = function(e) {
//     project_result.innerText = generateSlug(e.target.value);
// }
// project_name.addEventListener('input', inputHandler);
// project_name.addEventListener('propertychange', inputHandler);