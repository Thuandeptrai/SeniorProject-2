const mongoose = require("mongoose");
const conTest = new mongoose.Schema(
  {
    id:{
        type:String,
    },
    probList:{
        type: Array,
    },
    user:{
        type: Array,
    },
    isPrivated:{
        type: Boolean,
    },
    whoFinished:{
        type: Object
    }
    

  },
  {
    timestamps: true,
  }
);

const ConTest = mongoose.model("conTest", conTest);
module.exports = ConTest;
