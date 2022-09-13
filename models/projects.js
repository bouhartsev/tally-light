require("dotenv").config();

const { Pool } = require("pg");
const db_conf = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      ssl: {
        rejectUnauthorized: false,
      },
    };
const db = new Pool(db_conf);
let arr_fields = ["title", "quantity", "sound"];

let staticURLs = [];
let projects = {};

function addProj(title, props) {
  projects[title] = {
    quantity: props.quantity ? props.quantity : 0, // cameras quantity, must be >0
    sound: props.sound ? true : false, // enable sound by default
    live: props.live ? props.live : null, // utc time (in seconds) of last action plus delay ("autofinish at")
    live_timer: props.live_timer ? props.live_timer : null, // timer instance
    preview: props.preview ? props.preview : null,
    onair: props.onair ? props.onair : null,
    settings: [],
    directors: [],
    cameras: {},
  };
}

let allFromDB = db.query("SELECT * FROM projects", []);
allFromDB
  .then((res) => {
    if (res.rows.length) arr_fields = Object.keys(res.rows[0]);
    res.rows.forEach((el) => addProj(el["title"], el));
    console.log("DB connected");
  })
  .catch((err) => {
    // throw err;
    console.error(err);
  });

module.exports = {
  create: function (title, quantity, otherProps = {}) {
    let err = "";

    if (!title) err = "Wrong title.";
    else if (title.length < 3)
      err = "Wrong title. Must have 3 symbols or more.";
    else if (/[^a-z0-9-]/.test(title)) err = "Wrong title. Check symbols.";
    else if (
      title.indexOf("-") == 0 ||
      title.lastIndexOf("-") == title.length - 1 ||
      title.indexOf("--") != -1
    )
      err = "Wrong title. Check dashes.";
    else if (staticURLs.includes(title))
      err = "Wrong title. URL is already exists.";
    else if (this.check(title)) err = "Project '" + title + "' already exists.";

    quantity = parseInt(quantity);
    if (!quantity || quantity < 0) err += " Wrong quantity.";

    if (err) return err;
    else {
      addProj(title, { quantity: quantity, ...otherProps });
      this.save(title);
      return "Complete";
    }
  },
  check: function (title) {
    if (title in projects) return true;
    else return false;
  },
  checkLive: function (title) {
    return !!projects[title]?.live;
  },
  get: function (title) {
    if (this.check(title)) return projects[title];
    else return null;
  },
  remove: function (title) {
    if (this.check(title)) {
      delete projects[title];
      db.query("DELETE FROM projects WHERE title = $1;", [title]).catch((err) => {
        console.error(err);
      });
      if (!this.check(title)) return true;
    }
    return false;
  },
  checkLoading: allFromDB,
  save: function (title, fields = arr_fields) {
    fields = fields.filter(
      (x) => arr_fields.includes(x) && (x in projects[title])
    );
    if (!fields.length) {
      // console.log("DB: Nothing to save!");
      return false;
    }
    let vals = fields.map((k) => projects[title][k]);

    let q_string = "";
    fields.forEach((k, i) => (q_string += k + " = EXCLUDED." + k + ", "));
    q_string =
      "INSERT INTO projects (title, " +
      fields.join(", ") +
      ") VALUES ('" +
      title +
      "', '" +
      vals.join("', '") +
      "') ON CONFLICT (title) DO UPDATE SET " +
      q_string.slice(0, -2) +
      ";";
    db.query(q_string, [])
      // .then(res=>console.log("DB: saved"))
      .catch((err) => console.error(err));
    return true;
  },
  setStatic: function (url_arr) {
    if (staticURLs.length != 0) return false;
    staticURLs = url_arr;
    return true;
  },
};
