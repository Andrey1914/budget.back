const jwt = require("jsonwebtoken");

const User = require("../models/User");

const { RequestError } = require("../helper/requestError");

const authorize = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      throw RequestError(401, "Not authorized");
    }
    try {
      const { id } = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(id);
      if (!user || !user.token || user.token !== token) {
        throw RequestError(401, "Not authorized");
      }
      req.user = user;
      next();
    } catch (error) {
      throw RequestError(401, "Not authorized");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authorize;
