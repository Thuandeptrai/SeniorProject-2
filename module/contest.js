const mongoose = require("mongoose");
const conTest = new mongoose.Schema(
  {
    id: {
      type: String,
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
      type: Date,
    },
    dateEnded: {
      type: Date,
    },
    problem: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Contest = mongoose.model("Contest", conTest);
module.exports = Contest;
