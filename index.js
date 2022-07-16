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
const testCompiler = require("./routes/testcompiler");
const createProblem = require("./routes/createProblem");
const submitRouter = require("./routes/submit");
const singleproblem = require("./routes/singleproblem");
const userRouter = require("./routes/user")
const problem = require("./routes/problem");
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
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.get("/", verifyUserIsAdmin, (req, res) => {
  res.status(200).json("ok");
});

app.use("/auth", authRoute);
app.use("/testcompiler", verifyTokenAndAuthorization, testCompiler);
app.use("/createProblem", verifyUserIsAdmin, createProblem);
app.use("/problem", verifyTokenAndAuthorization, problem);

app.use("/singleproblem", verifyTokenAndAuthorization, singleproblem);

app.use("/submit", verifyTokenAndAuthorization, submitRouter);
app.use("/user", verifyTokenAndAuthorization, userRouter);

app.get("/testRoute", async (req,res) =>
{
  const getProb = await Prob.find({}).sort({createdAt: 1})
  res.status(200).json(getProb)
})


const PORT = process.env.PORT || 3001;
app.listen(PORT);
