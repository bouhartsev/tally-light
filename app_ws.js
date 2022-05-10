const projects = require("./models/project.js");

module.exports = function (server) {
  const { v4 } = require("uuid");
  const uuid = v4;

  // const { Server } = require('ws');
  // const wss = new Server({ server });
  const wss = require("socket.io")(server);

  var clients = {};
  // current_proj

  function send(client, message) {
    if (typeof message == "string") message = { status: message };
    client.send(JSON.stringify(message));
  }

  // wss.on('connection', function (ws, req) {
  wss.on("connection", function (socket) {
    // ws.id = uuid();
    const ws = socket;
    const req = {
      url: socket.handshake.headers.referer.split(
        socket.handshake.headers.host
      )[1],
    }; // FIX IT

    // works with not bare url (not only domain name). It's no exceptions.

    let url_arr = req.url.split("/").filter((val) => val); // all url's peaces without empty (first)
    let id = url_arr[0];

    console.log("New WS connection: " + id);

    // check id // TEMPORARY
    if (!(id in clients))
      clients[id] = {
        settings: [],
        directors: [],
        cameras: {},
        quantity: 0,
        preview: null,
        onair: null,
      };

    let number = -3; // -3 - not exists, -2 - settings, -1 - director, >0 - number of camera, 0 - reserved for camera used
    if (url_arr.length == 1 || url_arr[1] == "director") {
      number = -1;
    }
    // or empty in future // what about new??
    else if (url_arr[1] == "settings") {
      number = -2;
    }
    // cameras
    else if (url_arr.length > 1) {
      num = parseInt(url_arr[1]);
      if (Number.isInteger(num)) {
        if (num > 0 && num <= clients[id]["quantity"]) {
          number = num;
        }
      }
    }

    // add settings
    if (number == -2) {
      clients[id]["settings"].push(ws);
      send(ws, { title: id, quantity: clients[id]["quantity"] });
    }
    // add director
    else if (number == -1) {
      clients[id]["directors"].push(ws);
      send(ws, {
        quantity: clients[id]["quantity"],
        preview: clients[id]["preview"],
        onair: clients[id]["onair"],
      });
      for (let key in clients[id]["cameras"]) {
        if (clients[id]["cameras"][key].length) send(ws, { connected: key });
      }
    }
    // add camera
    else if (number > 0) {
      if (!(number in clients[id]["cameras"])) {
        clients[id]["cameras"][number] = [];
      }
      // send message to directors
      for (
        let i = 0;
        i < clients[id]["directors"].length &&
        !clients[id]["cameras"][number].length;
        i++
      ) {
        send(clients[id]["directors"][i], { connected: number });
      }
      clients[id]["cameras"][number].push(ws);
      if (number == clients[id]["onair"]) send(ws, "onair");
      if (number == clients[id]["preview"]) send(ws, "preview");
    } else {
      // send - ?
      // ws.close(4000, 'not exist');
      socket.disconnect(true);
    }

    ws.on("message", function (message) {
      console.log(`Message for "${id}" ` + message);
      message = JSON.parse(message);

      for (let i = 0; i < clients[id]["directors"].length; i++) {
        send(clients[id]["directors"][i], message);
      }
      // удалять камеры при изменении количества на сайте, удалять данные из preview и onair, отсоединять людей
      for (let key in message) {
        let value = message[key];

        // Нужно ли проверять ключ и значение, а также на null - ?

        if (key == "title") {
          if (projects.check(value)) send(ws, { wrong: "title" });
          else {
            try {
              projects.create(value, clients[id]["quantity"]);
            } catch (error) {
              send(ws, { wrong: "title" });
            }
            // послать всем камерам и страницам настроек информацию об изменении названия
            for (let i = 0; i < clients[id]["settings"].length; i++) {
              send(clients[id]["settings"][i], { change_title: value });
            }
            for (let camera_number in clients[id]["cameras"]) {
              for (
                let i = 0;
                i < clients[id]["cameras"][camera_number].length;
                i++
              ) {
                send(clients[id]["cameras"][camera_number][i], {
                  change_title: value,
                });
              }
            }
            // удалить данные текущего проекта
            delete clients[id];
            id = value;
            clients[id] = projects.get(id);
          }
        } else if (key == "quantity") {
            if (value < clients[id][key]) {
              Object.keys(clients[id]["cameras"])
                .filter((item) => item > value)
                .forEach((cam_key) => {
                  clients[id]["cameras"][cam_key].forEach((el) => {
                    // el.close(4000, "not exist");
                    el.disconnect();
                  });
                });
              if (clients[id]["preview"] > value) clients[id]["preview"] = null;
              if (clients[id]["onair"] > value) clients[id]["onair"] = null;
            }
            for (let i = 0; i < clients[id]["settings"].length; i++) {
              send(clients[id]["settings"][i], { quantity: value });
            }
          } else {
            if (value in clients[id]["cameras"]) {
              for (let i = 0; i < clients[id]["cameras"][value].length; i++) {
                send(clients[id]["cameras"][value][i], key);
              }
            }
            if (
              ((key == "preview" && clients[id]["onair"] != clients[id][key]) ||
                key == "onair") &&
              clients[id][key] != null &&
              clients[id][key] in clients[id]["cameras"]
            ) {
              for (
                let i = 0;
                i < clients[id]["cameras"][clients[id][key]].length;
                i++
              ) {
                send(clients[id]["cameras"][clients[id][key]][i], "connected");
              }
            }
        }

        clients[id][key] = value;
      }
      // save to database
    });

    // ws.on('close', function (code) {
    ws.on("disconnect", function (reason) {
      console.log("Close WS connetion: " + id + ", " + number);
      if (number == -1)
        // clients[id]['directors'] = clients[id]['directors'].filter(item => JSON.stringify(item)!=JSON.stringify(ws));
        clients[id]["directors"] = clients[id]["directors"].filter(
          (item) => item.id != ws.id
        );
      else if (number > 0) {
        clients[id]["cameras"][number] = clients[id]["cameras"][number].filter(
          (item) => item.id != ws.id
        );
        // send message to directors
        for (
          let i = 0;
          i < clients[id]["directors"].length &&
          !clients[id]["cameras"][number].length &&
          reason != "io server disconnect";
          i++
        ) {
          //code!=4000
          send(clients[id]["directors"][i], { disconnected: number });
        }
      }
    });
  });

  return wss;
};
