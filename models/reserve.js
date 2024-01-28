const mongoose = require("mongoose");
const reserveSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    reguired: true,
  },
});

module.exports = mongoose.model("Reserve", reserveSchema);
