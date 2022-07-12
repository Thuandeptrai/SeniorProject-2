const express = require("express");
const app = express();
const axios = require("axios");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./passport");
const authRoute = require("./routes/auth");
const User = require("./module/user");
const { v4: uuidv4 } = require("uuid");
const {
  verifyTokenAndAuthorization,
  verifyUserIsAdmin,
} = require("./verifyToken");
const Prob = require("./module/problems");
app.use(
  cookieSession({
    name: "session",
    keys: ["Test"],
    maxAge: 24 * 60 * 60 * 100,
    sameSite: "Lax",
  })
);

mongoose
  .connect(
    "mongodb+srv://thuan:rmk123456@cluster0.upcyp.mongodb.net/compiler?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("success"))
  .catch((err) => {
    console.log(err);
  });
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(cors({credentials: true, origin: 'https://playful-sunshine-3b1379.netlify.app/'})));
app.get("/", verifyUserIsAdmin, (req, res) => {
  res.status(200).json("ok");
});

app.use("/auth", authRoute);
app.post("/testcompiler", verifyTokenAndAuthorization, async (req, res) => {
  code = req.body.code;
  lang = req.body.lang;
  problemId = req.body.problemId;
  captcha = req.body.captcha;
  let validateCaptcha;
  try {
    await axios
      .get(
        `https://www.google.com/recaptcha/api/siteverify?secret=6LemUxAUAAAAAPlLsbu-XqI6vEnRDWlDwAtSyKl8&response=${captcha}`
      )
      .then((resdata) => {
        if (!resdata.data.success) {
          res.status(404).json("Wrong captcha");
        }
        validateCaptcha = resdata.data;
      })
      .catch((err) => {
        console.log(err);
      });

    const problem = await Prob.findOne({ id: problemId });
    const myArry = problem.testInput.split(" ");
    const ans = problem.testOutput.split(" ");
    let correct = 0;

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
          if (data.data.output === ans[i]) {
            correct++;
          }
        });
    }
    if (correct == myArry.length) {
      res.status(200).json("Passed");
    } else {
      if (validateCaptcha.success) {
        res.status(200).json("You are not passed");
      }
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/createProblem", verifyUserIsAdmin, async (req, res) => {
  const id = uuidv4();
  const descript = req.body.desc;
  const userCreated = req.user.id;
  const testInput = req.body.testInput;
  const testOutput = req.body.testOutPut;
  const realInput = req.body.realInput;
  const title = req.body.title;
  const realOutput = req.body.realOutput;
  const newProb = new Prob({
    id,
    desc: descript,
    userCreated,
    title,
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
});
app.get("/problem/:id", verifyTokenAndAuthorization, async (req, res) => {
  const ProbId = req.params;
  const Problem = await Prob.find({}).skip(ProbId.id);
  res.status(200).json(Problem);
});

app.get("/singleproblem/:id", verifyTokenAndAuthorization, async (req, res) => {
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
});

app.post("/submit", verifyTokenAndAuthorization, async (req, res) => {
  code = req.body.code;
  lang = req.body.lang;
  user = req.user;
  problemId = req.body.problemId;

  const problem = await Prob.findOne({ id: problemId });
  const myArry = problem.realInput.split(" ");
  const ans = problem.realOutput.split(" ");
  let correct = 0;
  try {
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
          if (data.data.output === ans[i]) {
            correct++;
          }
        });
    }
    if (correct === ans.length) {
      const userId = req.user.id;
      const getUser = await User.findOne({ id: userId });
      let solved = problem.ans;
      let getwrongAns = problem.wrongAns;
      let userSolved = getUser.problemSolved;
      let getUnSolved = getUser.problemWrong;
      if (getUnSolved.length !== 0 || getUnSolved !== null) {
        getUnSolved = getUnSolved.filter(
          (item) => !problemId.includes(item.Problem)
        );
      }
      if (getwrongAns.length !== 0 || getwrongAns !== null) {
        getwrongAns = getwrongAns.filter((item) => !userId.includes(item.id));
      }

      if (userSolved === null || userSolved.length === 0) {
        userSolved = [];
        userSolved.push(problemId);
      } else if (!userSolved.includes(problemId)) {
        userSolved.push(problemId);
      }

      if (!solved.includes(getUser.id)) {
        solved.push(getUser.id);
      }

      let update = await Prob.findOneAndUpdate(
        { id: problemId },
        { $set: { ans: solved } },
        { new: true }
      );

      let update1 = await User.findOneAndUpdate(
        { id: userId },
        { $set: { problemSolved: userSolved } },
        { new: true }
      );
      let update2 = await User.findOneAndUpdate(
        { id: userId },
        { $set: { problemWrong: getUnSolved } },
        { new: true }
      );
      if (getwrongAns.length === 0) {
        let updateUser = await Prob.findOneAndUpdate(
          { id: problemId },
          { $set: { wrongAns: getwrongAns } },

          { new: true }
        );
      }

      res.status(200).json(`${correct}/${ans.length}`);
    } else {
      const userId = req.user.id;
      const getUser = await User.findOne({ id: userId });
      let userUnSolved = getUser.problemWrong;
      let probUnSolved = problem.wrongAns;
      let userWasSolved = 0;
      for (let i = 0; i < problem.ans.length; i++) {
        if (problem.ans[i] === userId) {
          userWasSolved++;
        }
      }
      if (userWasSolved === 0) {
        if (userUnSolved === null || userUnSolved.length === 0) {
          userUnSolved = [];
          let prob = { Problem: problemId, Ans: correct };

          userUnSolved.push(prob);

          let update1 = await User.findOneAndUpdate(
            { id: userId },
            { $set: { problemWrong: userUnSolved } },
            { new: true }
          );
        } else {
          let flag = 0;
          for (let i = 0; i < userUnSolved.length; i++) {
            if (userUnSolved[i].Problem === problemId) {
              flag++;
              if (userUnSolved[i].Ans < correct) {
                userUnSolved[i].Ans = correct;
              }
            }
          }

          if (flag === 0) {
            let prob = { Problem: problemId, Ans: correct };
            userUnSolved.push(prob);
            let update1 = await User.findOneAndUpdate(
              { id: userId },
              { $set: { problemWrong: userUnSolved } },
              { new: true }
            );
          } else {
            let update1 = await User.findOneAndUpdate(
              { id: userId },
              { $set: { problemWrong: userUnSolved } },
              { new: true }
            );
          }
        }
        let flagb = 0;
        if (probUnSolved === null || probUnSolved.length === 0) {
          probUnSolved = [];
          let prob = { id: userId, Ans: correct };

          probUnSolved.push(prob);
          console.log(probUnSolved);
          let update1 = await Prob.findOneAndUpdate(
            { id: problemId },
            { $set: { wrongAns: probUnSolved } },
            { new: true }
          );
        } else {
          for (let i = 0; i < probUnSolved.length; i++) {
            if (probUnSolved[i].wrongAns === userId) {
              flagb++;
              if (probUnSolved[i].Ans < correct) {
                probUnSolved[i].Ans = correct;
              }
            }
          }
          if (flagb === 0) {
            let prob = { id: userId, Ans: correct };
            probUnSolved.push(prob);
            let update1 = await Prob.findOneAndUpdate(
              { id: problemId },
              { $set: { wrongAns: probUnSolved } },
              { new: true }
            );
          } else {
            let update1 = await Prob.findOneAndUpdate(
              { id: problemId },
              { $set: { wrongAns: probUnSolved } },
              { new: true }
            );
          }
        }
      }
      res.status(200).json(`${correct}/${ans.length}`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT);
