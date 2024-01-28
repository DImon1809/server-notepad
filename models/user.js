const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    lists: [{ type: mongoose.Types.ObjectId, ref: "List" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
