const router = require("express").Router();
const Prob = require("../module/problems");
const User = require("../module/user");
const axios = require("axios");

router.get("/desc/:id/:limit", async (req, res) => {
  const ProbId = req.params;
  const maxProb = await Prob.count({ isPrivate: false });
  var Limitquery = req.params.limit
  if(parseInt(Limitquery) === 0)
  {
    Limitquery = 10
  }
  if (ProbId.id > maxProb) {
    res.status(200).json({ getProb: "Full" });
  } else {
    const getProb = await Prob.find({ isPrivate: false })
      .skip(ProbId.id)
      .limit(Limitquery)
      .sort({ createdAt: -1 });
    let hasMore = true;
    let a = 0;
    a = parseInt(ProbId.id) + 10;
    if (a === maxProb || a >= maxProb) {
      res.status(200).json({ getProb, hasMore: false });
    } else {
      res.status(200).json({ getProb, hasMore });
    }
  }
});
router.get("/ascd/:id/:limit", async (req, res) => {
  const ProbId = req.params;
  const maxProb = await Prob.count({ isPrivate: false });
  var Limitquery = req.params.limit
  if(parseInt(Limitquery) === 0)
  {
    Limitquery = 10
  }

  if (ProbId.id === maxProb || ProbId.id >= maxProb) {
    res.status(200).json({ getProb: "Full" });

  } else {
    const limitId = req.params;
    const getProb = await Prob.find({ isPrivate: false })
      .skip(limitId.id)
      .limit(Limitquery)
      .sort({ createdAt: 1 });
    let hasMore = true;
    let a = 0;
    a = parseInt(ProbId.id) + 10;
    if (a === maxProb || a >= maxProb) {
      res.status(200).json({ getProb, hasMore: false });
    } else {
      res.status(200).json({ getProb, hasMore });
    }
  }
});
router.post("/find/:sort/:limit", async (req, res) => {
  sortquery = req.params.sort;
  query = req.body.query;
  var Limitquery = req.params.limit
  if(query !== "")
  {
  if(parseInt(Limitquery) === 0)
  {
    Limitquery = 5
  }
  const getLimitedQuery = await Prob.count({
    title: new RegExp(query, "i"),
    isPrivate: false,
  });
  if (sortquery === "desc") {
    const getProb = await Prob.find({
      title: new RegExp(query, "i"),
      isPrivate: false,
    })
      .limit(Limitquery)
      .sort({ createdAt: -1 });
    if (getProb.length !== 0) {
      if (getLimitedQuery < 5) {
        res.status(200).json({ getProb, hasMore: false });
      } else {
        res.status(200).json({ getProb, hasMore: true });
      }
    } else {
      res.status(404).json("Not Found");
    }
  } else {
    const getProb = await Prob.find({
      title: new RegExp(query, "i"),
      isPrivate: false,
    })
      .limit(Limitquery)
      .sort({ createdAt: 1 });
    if (getProb.length !== 0) {
      if (getLimitedQuery < 5) {
        res.status(200).json({ getProb, hasMore: false });
      } else {
        res.status(200).json({ getProb, hasMore: true });
      }
    } else {
      res.status(404).json("Not Found");
    }
  }
}else
{
  res.status(200).json("Not Found")
}

});
router.post("/finds/:sort/:id", async (req, res) => {
  sortquery = req.params.sort;
  let probPaginate = req.params;
  query = req.body.query;
  
  const getLimitedQuery = await Prob.count({
    title: new RegExp(query, "i"),
    isPrivate: false,
  });
  if (sortquery === "desc") {
    const getProb = await Prob.find({ title: new RegExp(query, "i")})
      .skip(probPaginate.id)
      .sort({ createdAt: -1 })
      .limit(5);
    let limited = parseInt(probPaginate.id) + 5;
    if (getProb.length !== 0) {
      if (limited > parseInt(getLimitedQuery)  ) {
        res.status(200).json({ getProb, hasMore: false ,totalLength: getLimitedQuery});
      } else {
        res.status(200).json({ getProb, hasMore: true ,totalLength:getLimitedQuery});
      }
    } else {
      res.status(200).json("Not Found");
    }
  } else {
    const getProb = await Prob.find({ title: new RegExp(query, "i") })
      .skip(probPaginate.id)
      .sort({ createdAt: 1 })
      .limit(5);
    let limited = parseInt(probPaginate.id) + 5;
    if (getProb.length !== 0) {
      if (limited > parseInt(getLimitedQuery)  ) {
        res.status(200).json({ getProb, hasMore: false ,totalLength: getLimitedQuery});
      } else {
        res.status(200).json({ getProb, hasMore: true ,totalLength:getLimitedQuery});
      }
    } else {
      res.status(200).json("Not Found");
    }
  }
});

module.exports = router;
