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
  if (this.check(title)) throw new Error("Project '" + title + "' already exists."); 
  else {
    projects[title] = {
      settings: [],
      directors: [],
      cameras: {},
      quantity: quantity,
      preview: null,
      onair: null,
    };
  }
}
module.exports.check = function check(title) {
  if (title in projects) return true;
  else return false;
}
module.exports.get = function get(title) {
  if (this.check(title)) return projects[title];
  else return null;
}
module.exports.remove = function remove(title) {
  if (this.check(title)) {
    delete projects[title];
    if (!this.check(title))
      return true;
  }
  return false;
}