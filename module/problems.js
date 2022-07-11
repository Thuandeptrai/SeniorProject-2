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
  wrongAns:{
    type:Array,
    default:[]
  }
});
const Prob = mongoose.model("problems", problems);
module.exports = Prob;
