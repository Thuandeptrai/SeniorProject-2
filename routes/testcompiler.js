const router = require("express").Router();
const Prob = require("../module/problems");
const User = require("../module/user");
const axios = require("axios");

router.post("/", async (req, res) => {
  code = req.body.code;
  lang = req.body.lang;
  problemId = req.body.problemId;
  captcha = req.body.captcha;
  let validateCaptcha;
  try {
    await axios
      .get(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA}&response=${captcha}`
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
    const myArry = problem.testInput;
    const ans = problem.testOutput;
    let correct = 0;

    for (let i = 0; i < myArry.length; i++) {
      let stdin = myArry[i]
        .replace(/<[^>]*>?/gm, " ")
        .replace(/\s+/g, " ")
        .trim();
      await axios
        .post(
          "https://www.jdoodle.com/engine/execute",
          {
            script: code,
            args: null,
            stdin: stdin,
            language: "cpp",
            libs: [],
            versionIndex: 5,
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
          console.log(data.data.output.replace(/(\r\n|\n|\r)/gm, " ").trim());
          console.log(
            ans[i]
              .replace(/<[^>]*>?/gm, " ")
              .replace(/\s+/g, " ")
              .trim()
          );
          if (data.data.output !== null) {
            if (
              data.data.output.replace(/(\r\n|\n|\r)/gm, " ").trim() ===
              ans[i]
                .replace(/<[^>]*>?/gm, " ")
                .replace(/\s+/g, " ")
                .trim()
            ) {
              correct++;
            }
          }
        });
    }
    if (correct === myArry.length) {
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
module.exports = router;
