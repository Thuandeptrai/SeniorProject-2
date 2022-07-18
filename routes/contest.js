const router = require("express").Router();
const Contest = require("../module/contest");
const { v4: uuidv4 } = require("uuid");
const { verifyUserIsAdmin } = require("../verifyToken");
router.get("/", async (req, res) => {
  res.status(200).json("This is contest route");
});

router.post("/createContest", verifyUserIsAdmin, async (req, res) => {
  const id = uuidv4();
  const probList = req.body.probList;
  const whoCreated = req.user.id;
  const user = req.body.user
  const isPrivated = req.body.isPrivated;
  const whoFinished = [];
  const dateStarted = req.body.dateStarted;
  const dateEnded = req.body.dateEnded;
  const problem = req.body.problem;
  const newContest = new Contest({
    id,
    problem,
    probList,
    isPrivated,
    whoFinished,
    dateStarted,
    dateEnded,
    user,
    whoCreated
  })
  await newContest.save().then(() =>
  {
    res.status(200).json({
        newContest
    })
  }).catch(() =>
  {
    res.status(500).json("Error");
  })
});


module.exports = router;
