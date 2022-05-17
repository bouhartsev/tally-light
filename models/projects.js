

let staticURLs = [];
let projects = {
  test: {
    settings: [],
    directors: [],
    cameras: {},
    quantity: 0,
    preview: null,
    onair: null,
  },
};

module.exports = {
  create: function (title, quantity, sound = false) {
    let err = "";
    
    if (!title) err = "Wrong title.";
    else if (/[^a-z0-9-]/.test(title)) err = "Wrong title. Check symbols."; // add checking for grammar
    else if (title.length<3) err = "Wrong title. Must have 3 symbols or more.";
    else if (staticURLs.includes(title)) err = "Wrong title. URL is already exists.";
    else if (this.check(title)) err = "Project '" + title + "' already exists.";
    
    if (err) return err;
    else {
      projects[title] = {
        settings: [],
        directors: [],
        cameras: {},
        quantity: quantity,
        preview: null,
        onair: null,
      };
      return "Complete";
    }
  },
  check: function (title) {
    if (title in projects) return true;
    else return false;
  },
  get: function (title) {
    if (this.check(title)) return projects[title];
    else return null;
  },
  remove: function (title) {
    if (this.check(title)) {
      delete projects[title];
      if (!this.check(title)) return true;
    }
    return false;
  },
  setStatic: function (url_arr) {
    if (staticURLs.length != 0) return false;
    staticURLs = url_arr;
    return true;
  },
};
