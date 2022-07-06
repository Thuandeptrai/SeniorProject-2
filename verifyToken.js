const verifyTokenAndAuthorization = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(403).json("You are not allowed");
  }
};

module.exports = 
  verifyTokenAndAuthorization

