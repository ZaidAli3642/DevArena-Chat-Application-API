const auth = (req, res, next) => {
  if (!req.headers["x-auth-token"])
    return res.status(401).json({ message: "User not authenticated." });

  next();
};

module.exports = auth;
