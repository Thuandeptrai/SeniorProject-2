const router = require("express").Router();
const Contest = require("../module/contest");
const User = require("../module/user");
const contestTicket = require("../module/contestTicket");
const Prob = require("../module/problems");
const axios = require("axios");

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
  const gradebyProblem = req.body.gradebyProblem;
  const newContest = new Contest({
    id,
    probList,
    gradebyProblem,
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
    .then(async () => {
      var probListTicket = [];
      for (let i = 0; i < probList.length; i++) {
        await probListTicket.push("");
      }
      for (let i = 0; i < user.length; i++) {
        newTicket = new contestTicket({
          contestId: id,
          userId: user[i],
          problemList: probListTicket,
        });
        await newTicket.save();
      }

      await res.status(200).json({
        newContest,
      });
    })
    .catch(() => {
      res.status(500).json("Error");
    });
});

router.get("/getAll", async (req, res) => {
  const Time = Date.now();
  try {
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
  } catch (err) {
    res.status(500).json("Something Wrong");
  }
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
      if (
        getContest[0].user.includes(getUser[0].id) ||
        getUser[0].isAdmin === true
      ) {
        res.status(200).json(getContest);
      } else {
        res.status(200).json("You are not allowed");
      }
    } else {
      res.status(200).json("The Contest does not start");
    }
  } catch (err) {
    res.status(500).json("Something Wrong");
  }
});
router.post("/submit/:probId/:id", async (req, res) => {
  const contestParams = req.params.id;
  const probId = req.params.probId;
  const Time = Date.now();
  const code = req.body.code;
  const lang = req.body.lang;
  const userId = req.user.id;
  const problem = await Prob.findOne({ id: probId });
  const getContest = await Contest.find({ id: contestParams });
  const getTicket = await contestTicket.find({
    userId: userId,
    contestId: contestParams,
  });
  const myArry = problem.realInput;
  const ans = problem.realOutput;
  var correct = 0;
  try {
    if (
      parseInt(Time) > parseInt(getContest[0].dateStarted) &&
      parseInt(Time) < parseInt(getContest[0].dateEnded)
    ) {
      for (let i = 0; i < myArry.length; i++) {
        let stdin = myArry[i];
        await axios
          .post(
            "https://www.jdoodle.com/engine/execute",
            {
              script: code,
              args: null,
              stdin: stdin,
              language: lang,
              libs: [],
              versionIndex: 1,
              projectKey: 1001,
              hasInputFiles: false,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (data) => {
            if (data.data.output !== null) {
              if (data.data.output.replace(/(\r\n|\n|\r)/gm, "") === ans[i]) {
                correct++;
              }
            }
          });
      }
      if (correct === ans.length) {
        const getUser = await User.findOne({ id: userId });
        var updateProblist = [];
        for (let i = 0; i < getTicket[0].problemList.length; i++) {
          updateProblist.push(getTicket[0].problemList[i]);
        }
        var getIndex = getContest[0].probList.indexOf(probId);
        updateProblist[getIndex] = correct.toString();
        var getScore = getContest[0].gradebyProblem[getIndex];
        var Subtract = 0;
        var getScoreFinal = 0;
        let PointPerTest = getScore / problem.realOutput.length;

        if (
          getTicket[0].problemList[getIndex].length === 0 ||
          parseInt(getTicket[0].problemList[getIndex]) <
            parseInt(problem.realOutput.length)
        ) {
          if (parseInt(getTicket[0].problemList[getIndex].length) !== 0) {
            Subtract =
              getTicket[0].grade -
              parseInt(getTicket[0].problemList[getIndex]) * PointPerTest;
            console.log(Subtract);
            getScoreFinal = Subtract + getScore;
          } else {
            getScoreFinal = getTicket[0].grade + correct * PointPerTest;
          }
          let update2 = await contestTicket.findOneAndUpdate(
            { userId: userId, contestId: contestParams },
            { $set: { grade: parseInt(getScoreFinal) } }
          );
        }
        let update1 = await contestTicket.findOneAndUpdate(
          { userId: userId, contestId: contestParams },
          { $set: { problemList: updateProblist } },
          { new: true }
        );

        let update33 = await contestTicket.findOne({
          userId: userId,
          contestId: contestParams,
        });

        let solved = problem.ans;
        let getwrongAns = problem.wrongAns;
        let userSolved = getUser.problemSolved;
        let getUnSolved = getUser.problemWrong;
        if (getUnSolved.length !== 0 || getUnSolved !== null) {
          getUnSolved = getUnSolved.filter(
            (item) => !probId.includes(item.Problem)
          );
        }
        if (getwrongAns.length !== 0 || getwrongAns !== null) {
          getwrongAns = getwrongAns.filter((item) => !userId.includes(item.id));
        }

        if (userSolved === null || userSolved.length === 0) {
          userSolved = [];
          userSolved.push(probId);
        } else if (!userSolved.includes(probId)) {
          userSolved.push(probId);
        }

        if (!solved.includes(getUser.id)) {
          solved.push(getUser.id);
        }
        let update = await Prob.findOneAndUpdate(
          { id: probId },
          { $set: { ans: solved } },
          { new: true }
        );
        if (getwrongAns.length === 0) {
          let updateUser = await Prob.findOneAndUpdate(
            { id: probId },
            { $set: { wrongAns: getwrongAns } },
            { new: true }
          );
        }
        res.status(200).json(`Passed`);
      } else {
        const userId = req.user.id;
        let indexOfProb = getContest[0].probList.indexOf(probId);

        const getUser = await User.findOne({ id: userId });
        let userWasSolved = 0;
        var updateProblist = [];
        var getScore = getContest[0].gradebyProblem[indexOfProb];
        var FinalScore = 0;
        var PointPerTest = getScore / problem.realOutput.length;

        for (let i = 0; i < getTicket[0].problemList.length; i++) {
          updateProblist.push(getTicket[0].problemList[i]);
        }
        updateProblist[indexOfProb] = correct.toString();
        if (
          parseInt(getTicket[0].problemList[indexOfProb]) ===
          problem.realOutput.length
        ) {
          userWasSolved++;
        }
        if (userWasSolved === 0) {
          console.log(getTicket[0].problemList[indexOfProb]);
          if (
            parseInt(correct) >
              parseInt(getTicket[0].problemList[indexOfProb]) ||
            getTicket[0].problemList[indexOfProb].length === 0
          ) {
            if (parseInt(getTicket[0].problemList[indexOfProb].length) !== 0) {
              var Subtract =
                getTicket[0].grade -
                parseInt(getTicket[0].problemList[indexOfProb]) * PointPerTest;
              FinalScore = Subtract + correct * PointPerTest;
            } else {
              FinalScore = getTicket[0].grade + correct * PointPerTest;
            }
            let update1 = await contestTicket.findOneAndUpdate(
              { userId: userId, contestId: contestParams },
              { $set: { problemList: updateProblist } },
              { new: true }
            );
            let update2 = await contestTicket.findOneAndUpdate(
              { userId: userId, contestId: contestParams },
              { $set: { grade: parseInt(FinalScore) } }
            );
          }
        }

        res.status(200).json(`${correct}/${ans.length}`);
      }
    } else {
      res.status(200).json("The contest do not open ");
    }
  } catch (err) {
    console.log(err);
    res.status(404).json("Something Went Wrong");
  }
});
router.get("/joinContest/:id", async (req, res) => {
  contestId = req.params.id;
  user = req.user.id;
  const Time = Date.now();
  try {
    const getContest = await Contest.find({ id: contestId });
    if (praseInt(getContest[0].dateEnded) < praseInt(Time)) {
      if (getContest[0].isPrivated !== true) {
        if (getContest[0].length !== 0) {
          if (getContest[0].user.includes(user)) {
            res.status(200).json("You are already joined");
          } else {
            var problemList = [];
            for (let i = 0; i < getContest[0].probList.length; i++) {
              await problemList.push("");
            }
            const newTicketUser = new contestTicket({
              contestId,
              userId: user,
              grade: 0,
              problemList,
            });
            await newTicketUser.save();
            await getContest[0].user.push(user);
            await Contest.findOneAndUpdate(
              { id: contestId },
              { user: getContest[0].user }
            );
            const ContestUpdate = await Contest.find({ id: contestId });
            res.status(200).json(ContestUpdate);
          }
        } else {
          res.status(200).json("Incorrect id");
        }
      } else {
        res.status(200).json("You Are Not Allowed");
      }
    } else {
      res.status(200).json("The contest is ended");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong");
  }
});

router.get("/contestTicket", async (req, res) => {
  const userId = req.user.id;
  try {
    const getContestTicket = await contestTicket.find({ userId });

    var userContestArr = [];
    var Time = Date.now();
    for (let i = 0; i < getContestTicket.length; i++) {
      let objectRes = {};
      const getContestinfo = await Contest.findOne({
        id: getContestTicket[i].contestId,
      });
      if (parseInt(getContestinfo.dateEnded) < Time) {
        userContestArr.push({
          conTestticket: getContestTicket[i],
          status: "Ended",
        });
      } else if (
        parseInt(getContestinfo.dateEnded) > Time &&
        parseInt(getContestinfo.dateStarted) <= Time
      ) {
        userContestArr.push({
          conTestticket: getContestTicket[i],
          status: "On going",
        });
      }else
      {
        userContestArr.push({
          conTestticket: getContestTicket[i],
          status: "The contest do not started",
        });
      }
    }
    res.status(200).json(userContestArr);
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong");
  }
});
router.get("/problem/:probId/:contestId", async (req,res) =>
{
  const probId = req.params.probId
  const contestId = req.params.contestId
  const Time = Date.now()
  try{
    const getContest = await Contest.findOne({id: contestId})
    if(getContest.dateStarted <= Time && Time < getContest.dateEnded )
    {
      const getProb = await Prob.findOne({id: probId})
      if(getProb)
      {
        const { realInput, realOutput, ...others } = getProb._doc
        res.status(200).json(others)
      }else
      {
        res.status(200).json("Not Found")
      }
    }else
    {
      res.status.json("The contest do not start")
    }
  }catch(err)
  {
    res.status(500).json("Something went wrong")
  }
})


module.exports = router;
