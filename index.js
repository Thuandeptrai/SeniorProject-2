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
  cookieSession({ name: "session", keys: ["Test"], maxAge: 24 * 60 * 60 * 100 })
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
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.get("/", verifyUserIsAdmin, (req, res) => {
  res.status(200).json("ok");
});

app.use("/auth", authRoute);
app.post("/Testcompiler", verifyTokenAndAuthorization, async (req, res) => {
  code = req.body.code;
  lang = req.body.lang;
  problemId = req.body.problemId;
  const problem = await Prob.findOne({ id: problemId });
  const myArry = problem.testInput.split(" ");

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
          if(data.data.output === myArry[i])
          {
            console.log("Oke")
          }
        });
      if (i == 2) {
        res.status(200).json("oke");
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
app.post("/createProblem", verifyUserIsAdmin, async (req, res) => {
  const id = uuidv4();
  const descript = req.body.desc;
  const userCreated = req.user.id;
  const testInput = req.body.testInput;
  const testOutput = req.body.testOutPut;
  const realInput = req.body.realInput;
  const realOutput = req.body.realOutput;
  const newProb = new Prob({
    id,
    desc: descript,
    userCreated,
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

app.listen(3001);
