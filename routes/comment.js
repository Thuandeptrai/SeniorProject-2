const router = require("express").Router();
const Contest = require("../module/contest");
const User = require("../module/user");
const contestTicket = require("../module/contestTicket");
const commentTicket = require("../module/commentTicket");
const Prob = require("../module/problems");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

router.post("/createComment", async (req, res) => {
  const comment = req.body.comment;
  const probId = req.body.probId;
  const id = uuidv4();
  const Time = Date.now();
  try {
    const findComment = await commentTicket.find({ probId });
    if (findComment.length === 0) {
      const newComment = new commentTicket({
        probId,
        comment: [
          {
            id,
            userId: req.user.id,
            comment,
            Time,
            reply: [],
          },
        ],
      });
      await newComment.save().then(() => {
        res.status(200).json(newComment);
      });
    } else {
      let updateArray = findComment[0].comment;
      await updateArray.push({
        id,
        userId: req.user.id,
        comment,
        Time,
        reply: [],
      });
      const Update = await commentTicket.findOneAndUpdate(
        {
          probId,
        },
        { $set: { comment: updateArray } }
      );
      const getComment = await commentTicket.find({ probId });
      res.status(200).json(getComment);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json("Something went wrong");
  }
});
router.post("/commentReply", async (req, res) => {
  const comment = req.body.comment;
  const commentReplyId = req.body.commentReplyId;
  const commentId = req.body.commentId;
  const id = uuidv4();
  const Time = Date.now();
  try {
    const findComment = await commentTicket.findOne({
      _id: commentId,
    });
    let commentReply = [];
    let flag = 123456789;
    for (let i = 0; i < findComment.comment.length; i++) {
      if (findComment.comment[i].id === commentReplyId) {
        flag = i;
      }
      commentReply.push(findComment.comment[i]);
    }
    if (commentReply.length === 0 || flag === 123456789) {
      res.status(200).json("Not Found");
    } else {
      await commentReply[flag].reply.push({
        id,
        userId: req.user.id,
        comment,
        Time,
      });

      const Update = await commentTicket.findOneAndUpdate(
        {
          commentId,
        },
        { $set: { comment: commentReply } }
      );
      const getComment = await commentTicket.find({ commentId });
      res.status(200).json(getComment);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json("Something went wrong");
  }
});

router.get("/getComment/:probId", async (req, res) => {
  const probId = req.params.probId;
  try {
    const getComment = await commentTicket.findOne({ probId });
    if (getComment) {
      res.status(200).json(getComment);
    } else {
      res.status(200).json(0);
    }
  } catch (err) {
    res.status(404).json("Something went wrong");
  }
});
router.get("/like/:id", async (req, res) => {
  const commentId = req.params.id;
  try {
    const getCommenttoLike = await commentTicket.findOne({ _id: commentId });
    if (getCommenttoLike) {
      let Like = getCommenttoLike.like;
      Like = Like + 1;
      await commentTicket.findOneAndUpdate(
        { _id: commentId },
        { $set: { like: Like } }
      );
      const Comment = await commentTicket.findOne({_id: commentId })
      res.status(200).json(Comment)
    } else {
      res.status(404).json("Not Found");
    }
  } catch (err) {
    console.log(err)
    res.status(404).json("Something went wrong");
  }
});
module.exports = router;
