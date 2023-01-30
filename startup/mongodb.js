const config = require("config");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(config.get("mongo_db_url"))
    .then(() => console.log("Connected to mongo db..."))
    .catch((err) =>
      console.log("ERROR OCCURED WHILE CONNECTING MONGO DB : ", err)
    );
};
