const List = require("../models/list");
const User = require("../models/user");

module.exports = class ListController {
  async getAll(req, res) {
    try {
      const { userId } = req.user;

      const lists = await List.find({ owner: userId });

      if (!lists)
        return res
          .status(400)
          .json({ message: "У данного пользователя нет списков!" });

      return res.status(200).json(lists);
    } catch (err) {
      console.error(err);

      return res.status(500).json({ message: "Что-то пошло не так!" });
    }
  }

  async create(req, res) {
    try {
      const { title, paragraph } = req.body;
      const { userId } = req.user;

      const coincidence = await List.findOne({ owner: userId, title });

      if (coincidence)
        return res.status(406).json({
          message:
            "Запись с данный заголовком уже существует! Пожалуйства введите новый!",
        });

      const list = new List({
        title,
        paragraph,
        owner: userId,
      });

      const response = await list.save();

      const user = await User.findById(userId);

      user.lists.push(response._id);

      await user.save();

      return res.status(201).json({ message: "Запись успешно создана!", list });
    } catch (err) {
      console.error(err);

      return res.status(500).json({ message: "Что-то пошло не так!" });
    }
  }

  async findOne(req, res) {
    try {
      const list = await List.findById(req.params.id);

      if (!list)
        return res.status(400).json({ message: "Данная запись не найдена!" });

      return res.status(200).json(list);
    } catch (err) {
      console.error(err);

      return res.status(500).json({ message: "Что-то пошло не так!" });
    }
  }

  async deleteOne(req, res) {
    try {
      const { userId } = req.user;
      const idElem = req.params.id;

      const response = await List.findByIdAndDelete(idElem);

      if (!response)
        return res.status(400).json({ message: "Что-то пошло не так!" });

      const user = await User.findById(userId);

      user.lists = user.lists.filter((elem) => !elem.equals(idElem));

      await user.save();

      return res.status(200).json({ message: "Запись успешно удалена!" });
    } catch (err) {
      console.error(err);

      return res.status(500).json({ message: "Что-то пошло не так!" });
    }
  }

  async updateOne(req, res) {
    try {
      const { title: updateTitle, paragraph: updateParagraph } = req.body;
      const idElem = req.params.id;

      const list = await List.findByIdAndUpdate(idElem, {
        title: updateTitle,
        paragraph: updateParagraph,
      });

      if (!list)
        return res.status(400).json({ message: "Записи не существует!" });

      await list.save();

      return res.status(200).json({ message: "Запись успешно обновлена!" });
    } catch (err) {
      console.error(err);

      return res.status(500).json({ message: "Что-то пошло не так!" });
    }
  }
};
