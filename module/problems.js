const mongoose = require("mongoose");
const problems = new mongoose.Schema({
  id: {
    type: String,
  },
  desc: {
    type: String,
  },

  testInput: {
    type: String,
  },
  testOutPut: {
    type: String,
  },
  realInput: {
    type: String,
  },
  realOutPut: {
    type: String,
  },
});
const Prob = mongoose.model("problems", problems);
module.exports = Prob;
