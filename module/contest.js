const mongoose = require("mongoose");
const conTest = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

const ConTest = mongoose.model("conTest", conTest);
module.exports = ConTest;
