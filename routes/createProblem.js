const router = require("express").Router()
const Prob = require("../module/problems")
const User = require("../module/user")
const { v4: uuidv4 } = require("uuid");
router.post("/",async (req,res) =>
{
    const id = uuidv4();
    const descript = req.body.desc;
    const userCreated = req.user.id;
    const testInput = req.body.testInput;
    const testOutput = req.body.testOutPut;
    const realInput = req.body.realInput;
    const title = req.body.title;
    const isPrivate = req.body.isPrivate
    const realOutput = req.body.realOutput;
    const newProb = new Prob({
      id,
      desc: descript,
      userCreated,
      title,
      isPrivate,
      testInput,
      testOutput,
      realInput,
      realOutput,
    });
    await newProb
      .save()
      .then(() => {
        res.status(200).json({
          newProb,
        });
      })
      .catch(() => {
        res.status(500).json("Error");
      });
})
module.exports = router;