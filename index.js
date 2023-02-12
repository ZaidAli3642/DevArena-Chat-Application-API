const config = require("config");
const express = require("express");
const Cors = require("cors");

const mondoDB = require("./startup/mongodb");
const { RegisterRoute, LoginRoute, UserRoute } = require("./api/routes");

const app = express();

mondoDB();

app.use(Cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", RegisterRoute);
app.use("/api", LoginRoute);
app.use("/api", UserRoute);

const port = config.get("PORT") || 3000;

app.listen(port, () => console.log("Listening on port # " + port));
