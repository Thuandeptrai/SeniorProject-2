const User = require("./module/user");
const verifyTokenAndAuthorization = async (req, res, next) => {

  if (req.user) {
    next();
  } else {
    res.status(403).json("You are not allowed");
  }
};
const verifyUserIsAdmin = async (req, res, next) => {

  if (req.user) {
    const userId = req.user.id;
    const IsAdmin = await User.findOne({ id: userId });
    console.log(IsAdmin)
    if (IsAdmin.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed");
    }
  } else {
    res.status(403).json("You are not allowed");
  }
};

module.exports = { verifyTokenAndAuthorization, verifyUserIsAdmin };
