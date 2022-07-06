const mongoose = require("mongoose");
const problems = new mongoose.Schema({
  id: {
    type: String,
  },
  desc: {
    type: String,
  },
  userCreated:{
    type:String,
  },
  testInput: {
    type: String,
  },
  testOutput: {
    type: String,
  },
  realInput: {
    type: String,
  },
  realOutput: {
    type: String,
  },
});
const Prob = mongoose.model("problems", problems);
module.exports = Prob;
