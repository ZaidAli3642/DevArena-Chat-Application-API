const jsonwebtoken = require("jsonwebtoken");
const config = require("config");

module.exports = (payload) =>
  jsonwebtoken.sign(payload, config.get("privateKey"));
