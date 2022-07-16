const router = require("express").Router();
const Prob = require("../module/problems");
const User = require("../module/user");
const axios = require("axios");

router.get("/:id", async (req, res) => {
    const userId = req.params;
    const getUser = await User.find({ id: userId.id });
    if (getUser) {
      res.status(200).json(getUser);
    } else {
      res.status(400).json("Not Found");
    }
});
module.exports = router