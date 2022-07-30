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
      await updateArray.splice(0, 0, {
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
    if (flag === 123456789) {
      res.status(200).json("Not Found");
    } else {
      console.log(findComment.comment[flag]);
      await commentReply[flag].reply.splice(0, 0, {
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
    var userId = [];
    if (getComment) {
      for (let i = 0; i < getComment.comment.length; i++) {
        const getUser = await User.findOne({
          id: getComment.comment[i].userId,
        });
        userId.push(getUser.name);
      }
      res.status(200).json({ getComment, userId });
    } else {
      res.status(200).json(0);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json("Something went wrong");
  }
});
router.get("/like/:id", async (req, res) => {
  const commentId = req.params.id;
  const UserId = req.user.id;
  try {
    const getCommenttoLike = await commentTicket.findOne({ _id: commentId });
    if (getCommenttoLike) {
      let Like = getCommenttoLike.like;
      if (!getCommenttoLike.wholiked.includes(UserId)) {
        Like = Like + 1;
        getCommenttoLike.wholiked.push(UserId);
      }
      if (getCommenttoLike.whodisliked.includes(UserId)) {
        getCommenttoLike.whodisliked = getCommenttoLike.whodisliked.filter(
          (item) => item !== UserId
        );
      }
      await commentTicket.findOneAndUpdate(
        { _id: commentId },
        { $set: { like: Like } }
      );
      await commentTicket.findOneAndUpdate(
        { _id: commentId },
        { $set: { wholiked: getCommenttoLike.wholiked } }
      );
      await commentTicket.findOneAndUpdate(
        { _id: commentId },
        { $set: { whodisliked: getCommenttoLike.whodisliked } }
      );
      const Comment = await commentTicket.findOne({ _id: commentId });
      res.status(200).json(Comment);
    } else {
      res.status(404).json("Not Found");
    }
  } catch (err) {
    console.log(err);
    res.status(404).json("Something went wrong");
  }
});

router.get("/disliked/:id", async (req, res) => {
  const commentId = req.params.id;
  const UserId = req.user.id;
  try {
    const getCommenttoDislike = await commentTicket.findOne({ _id: commentId });
    if (getCommenttoDislike) {
      let Like = getCommenttoDislike.like;
      if (!getCommenttoDislike.whodisliked.includes(UserId)) {
        Like = Like - 1;
        getCommenttoDislike.whodisliked.push(UserId);
      }
      if (getCommenttoDislike.wholiked.includes(UserId)) {
        getCommenttoDislike.wholiked = getCommenttoDislike.wholiked.filter(
          (item) => item !== UserId
        );
      }
      await commentTicket.findOneAndUpdate(
        { _id: commentId },
        { $set: { like: Like } }
      );
      await commentTicket.findOneAndUpdate(
        { _id: commentId },
        { $set: { wholiked: getCommenttoDislike.wholiked } }
      );
      await commentTicket.findOneAndUpdate(
        { _id: commentId },
        { $set: { whodisliked: getCommenttoDislike.whodisliked } }
      );
      const Comment = await commentTicket.findOne({ _id: commentId });
      res.status(200).json(Comment);
    } else {
      res.status(404).json("Not Found");
    }
  } catch (err) {
    console.log(err);
    res.status(404).json("Something went wrong");
  }
});
module.exports = router;
