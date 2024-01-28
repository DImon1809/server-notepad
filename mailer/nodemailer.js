const nodemailer = require("nodemailer");

require("dotenv").config();

module.exports = nodemailer.createTransport(
  {
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: "klimov.dmitrij.02@mail.ru",
      pass: process.env.PASS_EMAIL,
    },
  },
  { from: "klimov.dmitrij.02@mail.ru" }
);
