const mongoose = require("mongoose");
const contestTicketdb = new mongoose.Schema(
  {
    contestId: {
      type: String,
    },
    userId: {
      type: String,
    },
    grade: {
      type: Number,
      default: 0,
    },
    problemList: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const contestTicket = mongoose.model("contestTicket", contestTicketdb);
module.exports = contestTicket;
