const mongoose = require("mongoose");
const commentTicketdb = new mongoose.Schema(
  {
    probId: {
      type: String,
    },
    comment: {
      type: Array,
      default: [],
    },
    like:{
        type:Number,
        default:0
    },
    wholiked:
    {
      type:Array,
      default:[]
    },
    whodisliked:{
      type:Array,
      default:[]
    }
  },
  {
    timestamps: true,
  }
);

const commentTicket = mongoose.model("commentTicket", commentTicketdb);
module.exports = commentTicket;
