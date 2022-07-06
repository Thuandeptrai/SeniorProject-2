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
const verifyTokenAndAuthorization = require("./verifyToken")
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
app.get("/",verifyTokenAndAuthorization , (req,res)=>
{
  res.status(200).json("ok")
})

app.use("/auth", authRoute);
app.post("/Testcompiler",verifyTokenAndAuthorization, async (req, res) => {
  code = req.body.code;
  lang = req.body.lang;
  stdin = req.body.stdin;
  try {
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
        res.status(200).json(data.data);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(3001);
