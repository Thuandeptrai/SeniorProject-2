const router = require("express").Router();
const Prob = require("../module/problems")
const User = require("../module/user")
const axios = require("axios")

router.get("/:id",async (req,res) =>
{
    const singProb = req.params.id;

    const getsingleProb = await Prob.find({ id: singProb });
    try {
      if (getsingleProb.length !== 0) {
        const { realInput, realOutput, ...others } = getsingleProb[0]._doc;
        res.status(200).json(others);
      } else {
        res.status(404).json("Not Found");
      }
    } catch (err) {
      res.status(404).json(err.message);
    }
})
module.exports = router