const mongoose = require("mongoose");
const problems = new mongoose.Schema({
  id: {
    type: String,
  },
  desc: {
    type: String,
  },
  title:
  {
    type:String,
  },
  ans:{
    type:Array,
    default:[]
  },
  userCreated:{
    type:String,
  },
  testInput: {
    type: Array,
  },
  testOutput: {
    type: Array,
  },
  realInput: {
    type: Array,
  },
  realOutput: {
    type: Array,
  },
  wrongAns:{
    type:Array,
    default:[]
  }
});
const Prob = mongoose.model("problems", problems);
module.exports = Prob;
