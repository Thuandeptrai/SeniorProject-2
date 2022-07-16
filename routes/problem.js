const router = require("express").Router();
const Prob = require("../module/problems")
const User = require("../module/user")
const axios = require("axios")

router.get("/desc/:id" , async(req,res) =>
{
  const ProbId = req.params;
  const maxProb = await Prob.count({isPrivate:false});
  if(ProbId.id === maxProb || ProbId.id >= maxProb)
  {
    res.status(200).json("Full")
  }else
  {

  const limitId = req.params
  const getProb = await Prob.find({isPrivate:false}).skip(limitId.id).limit(10).sort({createdAt: -1})
  res.status(200).json(getProb)
}


})
router.get("/ascd/:id" , async(req,res) =>
{

  const ProbId = req.params;
  const maxProb = await Prob.count({});
  if(ProbId.id === maxProb || ProbId.id >= maxProb)
  {
    res.status(200).json("Full")
  }else
  {

  const limitId = req.params
  const getProb = await Prob.find({isPrivate:false}).skip(limitId.id).limit(10).sort({createdAt: 1})
  res.status(200).json(getProb)
}

  
})
router.post("/find" , async (req,res) =>
{
   query = req.body.query
   const getProb = await Prob.find({title : new RegExp(query, 'i')})
   if(getProb.length !== 0)
   {
    res.status(200).json(getProb)
   }else
   {
    res.status(404).json("Not Found")
   }
})
module.exports = router