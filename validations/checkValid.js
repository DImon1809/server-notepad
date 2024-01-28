const { body } = require("express-validator");

module.exports = [
  body("email", "Е-маил не является валидным!").isEmail(),
  body("password", "Пароль должен содержать минимум 6 символов!")
    .notEmpty()
    .isLength({ min: 6 }),
];
