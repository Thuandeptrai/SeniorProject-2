const router = require("express").Router();
const Contest = require("../module/contest");
const User = require("../module/user");

const { v4: uuidv4 } = require("uuid");
const { verifyUserIsAdmin } = require("../verifyToken");
router.get("/", async (req, res) => {
  res.status(200).json("This is contest route");
});

router.post("/createContest", verifyUserIsAdmin, async (req, res) => {
  const id = uuidv4();
  const probList = req.body.probList;
  const whoCreated = req.user.id;
  const user = req.body.user1;
  const Description = req.body.Description;
  const title = req.body.title;
  const isPrivated = req.body.isPrivated;
  const whoFinished = {};
  const dateStarted = req.body.dateStarted;
  const dateEnded = req.body.dateEnded;
  const problem = req.body.problem;
  const newContest = new Contest({
    id,
    problem,
    probList,
    Description,
    title,
    isPrivated,
    whoFinished,
    dateStarted,
    dateEnded,
    user,
    whoCreated,
  });
  await newContest
    .save()
    .then(() => {
      res.status(200).json({
        newContest,
      });
    })
    .catch(() => {
      res.status(500).json("Error");
    });
});

router.get("/getAll", async (req, res) => {
  const Time = Date.now();
  const getAllContest = await Contest.find({ isPrivated: false });
  let allContest = [];
  for (let i = 0; i < getAllContest.length; i++) {
    if (parseInt(Time) < parseInt(getAllContest[i].dateEnded)) {
      let a = {};
      if (
        parseInt(Time) === parseInt(getAllContest[i].dateStarted) ||
        parseInt(Time) > parseInt(getAllContest[i].dateStarted)
      ) {
        a = {
          title: getAllContest[i].title,
          desc: getAllContest[i].Description,
          status: "On Going",
        };
      } else {
        a = {
          title: getAllContest[i].title,
          desc: getAllContest[i].Description,
          status: "Not Start",
        };
      }

      allContest.push(a);
    }
  }
  res.status(200).json(allContest);
});

router.get("/singleContest/:id", async (req, res) => {
  const contestParams = req.params;
  const Time = Date.now();
  try {
    const getUser = await User.find({ id: req.user.id });
    const getContest = await Contest.find({ id: contestParams.id });
    if (
      parseInt(Time) > parseInt(getContest[0].dateStarted) &&
      parseInt(Time) < parseInt(getContest[0].dateEnded)
    ) {
      if (getContest[0].user.includes(getUser[0].id) || getUser[0].isAdmin === true) {
        res.status(200).json(getContest);
      } else {
        res.status(200).json("You are not Allowed");
      }
    } else {
      res.status(200).json("The Contest does not start");
    }
  } catch (err) {
    res.status(500).json("Something Wrong");
  }
});
router.get("/submit/:probId/:id", async (req, res) => {
  const contestParams = req.params;
  const Time = Date.now();
  const getContest = await Contest.find({ id: contestParams.id });
  if (
    parseInt(Time) > parseInt(getContest[0].dateStarted) &&
    parseInt(Time) < parseInt(getContest[0].dateEnded)
  ) {
    res.status(200).json(getContest);
  } else {
    res.status(200).json("Not Oke");
  }
});

module.exports = router;
