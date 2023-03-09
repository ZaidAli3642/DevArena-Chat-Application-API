const config = require("config");
const express = require("express");
const http = require("http");
const Cors = require("cors");

const mondoDB = require("./startup/mongodb");
const {
  RegisterRoute,
  LoginRoute,
  UserRoute,
  ConverstaionRoute,
  MessagesRoute,
} = require("./api/routes");
const socketService = require("./utils/socket");

const app = express();

mondoDB();

app.use(Cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", RegisterRoute);
app.use("/api", LoginRoute);
app.use("/api", UserRoute);
app.use("/api", ConverstaionRoute);
app.use("/api", MessagesRoute);
const port = config.get("PORT") || 3000;

const server = http.createServer(app);

socketService(server);

server.listen(port, () => console.log("Listening on port # " + port));
