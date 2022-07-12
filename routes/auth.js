const router = require("express").Router();
const passport = require("passport");
const User = require("../module/user");

const CLIENT_URL = "https://fontend2223.herokuapp.com";
router.get("/login/success", async (req, res) => {
  if (req.user) {
    let existingUser = await User.findOne({ id: req.user.id });
    if (!existingUser) {
      const newUser = new User({
        id: req.user.id,
        name: req.user.displayName,
        problemSolved: null,
        problemWrong: null,
        cookies: req.cookies,
      });
      await newUser.save().then(() => {
        res.status(200).json({
          success: true,
          message: "successfull",
          user: newUser,
          cookies: req.cookies,
        });
      });
    } else {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: existingUser,
        cookies: req.cookies,
      });
    }
  } else {
    res.status(404).json("Does not have a user");
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate(
    "google",
    {
      successRedirect: CLIENT_URL,
      failureRedirect: "/login/failed",
      
    },
    
  )
);
module.exports = router;
