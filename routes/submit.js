const router = require("express").Router();
const Prob = require("../module/problems");
const User = require("../module/user");
const axios = require("axios");

router.post("/", async (req, res) => {
  code = req.body.code;
  lang = req.body.lang;
  user = req.user;
  captcha = req.body.captcha;
  problemId = req.body.problemId;
  let validateCaptcha;

  await axios
    .get(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LemUxAUAAAAAPlLsbu-XqI6vEnRDWlDwAtSyKl8&response=${captcha}`
    )
    .then((resdata) => {
      if (!resdata.data.success) {
        res.status(404).json("Wrong captcha");
      }
      validateCaptcha = resdata.data.success;
    })
    .catch((err) => {
      console.log(err);
    });

  const problem = await Prob.findOne({ id: problemId });
  const myArry = problem.realInput;
  const ans = problem.realOutput;
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
          if (data.data.output !== null) {
            if (data.data.output.replace(/(\r\n|\n|\r)/gm, "") === ans[i]) {
              correct++;
            }
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
      if (validateCaptcha) {
        res.status(200).json(`Passed`);
      }
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

      if (validateCaptcha) {
        res.status(200).json(`${correct}/${ans.length}`);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
router.get("/", (req, res) => {
  res.status(200).json("got it");
});
module.exports = router;
