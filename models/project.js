const projects = {"test":{
  settings: [],
  directors: [],
  cameras: {},
  quantity: 0,
  preview: null,
  onair: null,
}};

module.exports.create = function create(title, quantity, sound = false) {
  // add checking for actual routers and grammar
  if (!this.check(title)) {
    projects[title] = {
      settings: [],
      directors: [],
      cameras: {},
      quantity: quantity,
      preview: null,
      onair: null,
    };
  } else throw new Error("Project '" + title + "' making error. Maybe it already exists."); 
}
module.exports.check = function check(title) {
  if (title in projects) return true;
  else return false;
}
module.exports.get = function get(title) {
  if (this.check(title)) return projects[title];
  else return null;
}
