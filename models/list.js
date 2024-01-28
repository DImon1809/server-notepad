const mongoose = require("mongoose");
const listSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    paragraph: String,

    owner: { type: mongoose.Types.ObjectId, ref: "User" },

    date: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("List", listSchema);
