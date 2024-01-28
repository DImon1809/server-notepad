const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token)
      return res.status(401).json({ message: "Вы не авторизовались!" });

    req.user = await jwt.verify(token, process.env.JWT_KEY);

    next();
  } catch (err) {
    console.error(err);
  }
};
