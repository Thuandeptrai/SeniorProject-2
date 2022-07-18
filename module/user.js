const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    
    problemSolved:{
        type: Array,
        default : []
    },
    problemWrong:{
      type: Array,
      default : []
    },
    isAdmin:{
      type: Boolean,
      default: false
    },
    contestJoined:{
      type:Array,
      default: []
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
