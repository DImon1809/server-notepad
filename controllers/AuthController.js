const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");
const User = require("../models/user");
const Reserve = require("../models/reserve");
const generatorOfCode = require("../mailer/generatorOfCode");
const transporter = require("../mailer/nodemailer");

require("dotenv").config();

module.exports = class AuthController {
  async refresh(req, res) {
    try {
      const { userId } = req.user;

      const user = await User.findById(userId);

      if (!user)
        return res.status(400).json({ message: "Пользователь не существует!" });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });

      return res.status(200).json({ message: "Успех", token, exp: 3600000 });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: "Не удалось зарегистрироваться!" });
    }
  }

  async repeat(req, res) {
    try {
      const { email } = req.body;

      const candidate = await Reserve.findOne({ email });

      const repeatCode = generatorOfCode();

      candidate.code = repeatCode;

      await transporter.sendMail({
        to: email,
        subject: "Данное сообщение не требует ответа!",
        text: `Ваш код: ${repeatCode}`,
      });

      await candidate.save();

      return res.status(200).json({ message: "Новый код отправлен!" });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: "Не удалось зарегистрироваться!" });
    }
  }

  async confirm(req, res) {
    try {
      const { code, email } = req.body;

      const candidate = await Reserve.findOne({ email });

      if (code !== candidate.code)
        return res.status(406).json({ message: "Неверный код!" });

      const user = await User({
        email,
        password: candidate.password,
      });

      await user.save();

      await Reserve.findOneAndDelete({ email });

      return res.status(201).json({ message: "Пользователь успешно создан!" });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: "Не удалось зарегистрироваться!" });
    }
  }

  async register(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        return res.status(400).json({ message: errors["errors"][0]["msg"] });

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate)
        return res
          .status(400)
          .json({ message: "Пользователь с таким логином уже есть!" });

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      await Reserve.findOneAndDelete({ email });

      const code = generatorOfCode();

      const reserve = new Reserve({
        email,
        password: hashPassword,
        code,
      });

      await reserve.save();

      await transporter.sendMail({
        to: email,
        subject: "Данное сообщение не требует ответа!",
        text: `Ваш код: ${code}`,
      });

      return res.status(202).json({ message: "Данные отправлены в резерв!" });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: "Не удалось зарегистрироваться!" });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);

      const { email, password } = req.body;

      if (!errors.isEmpty())
        return res.status(400).json({ message: errors["errors"][0]["msg"] });

      const user = await User.findOne({ email });

      if (!user)
        return res
          .status(400)
          .json({ message: "Такой пользователь не существует!" });

      const decode = await bcrypt.compare(password, user.password);

      if (!decode) return res.status(400).json({ message: "Неверный пароль!" });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });

      return res.status(200).json({ message: "Успех", token, exp: 3600000 });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: "Не удалось зарегистрироваться!" });
    }
  }
};
