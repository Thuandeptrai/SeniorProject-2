const mongoose = require("mongoose");
const conTest = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    title:{
      type:String
    },
    Description:{
      type:String,
    },
    whoCreated:
    {
      type: String
    },
    probList: {
      type: Array,
    },
    user: {
      type: Array,
    },
    isPrivated: {
      type: Boolean,
    },
    whoFinished: {
      type: Object,
    },
    dateStarted: {
      type: String,
    },
    dateEnded: {
      type: String,
    },

    gradebyProblem:{
      type:Array,
    }
  },
  {
    timestamps: true,
  }
);

const Contest = mongoose.model("Contest", conTest);
module.exports = Contest;
