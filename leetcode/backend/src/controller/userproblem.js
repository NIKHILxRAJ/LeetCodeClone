
const problem = require("../model/problems");
const submission = require("../model/submission");
const User = require('../model/user');
const { getlanguagebyid} = require('../utils/problemutils');

const createproblem = async (req, res) => {
  try {
    const { visibletestcases, referencesolution } = req.body;

    if (!Array.isArray(visibletestcases)) {
      return res.status(400).send("visibletestcases must be an array");
    }

    await problem.create({
      ...req.body,
      problemcreator: req.result._id   // ✅ FIX HERE
    });

    return res.status(201).send("Problem saved successfully");

  } catch (err) {
    console.error("Error in createproblem:", err);
    return res.status(400).send("Error: " + err.message);
  }
};

const updateproblem = async (req, res) => {
    const {id}=req.params
    const { title, description, visibletestcases, hiddentestcases,
            startcode, referencesolution, problemcreator } = req.body;
   try{ 
    if(!id){
        return res.status(500).send('missing id field');
    }
      const dsaproblem=await problem.findById(id);
      if(!dsaproblem){
        return res.status(404).send("id is not present in server");
      }
       if (!visibletestcases) {
      return res.status(400).send(`visibletestcases is undefined. Body keys: ${Object.keys(req.body || {})}`);
    
       }
    if (!Array.isArray(visibletestcases)) {
      return res.status(400).send(`visibletestcases is not an array. Type: ${typeof visibletestcases}, Value: ${visibletestcases}`);
    }

   
    for (const solution of referencesolution) {
      const { language, completecode } = solution;
      const languageid = getlanguagebyid(language);      
      const submission = visibletestcases.map((testcase) => ({
        source_code: completecode,
        language_id: languageid,
        stdin: testcase.input,
        expected_output: testcase.output
      })); 
      // ... rest of your code
    }
            const newproblem=await problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
            res.status(201).send(newproblem);


        
    }
            
    catch(err){
       res.status(404).send("error"+err);

            }

};
const deleteproblem = async (req, res) => {
    const {id}=req.params
try{
      if(!id){
        return res.status(400).send('missing id field');
    }
    const deleteproblem=await problem.findByIdAndDelete(id);
    if(!deleteproblem){
         return res.status(400).send('problem is missing');}
          res.status(400).send("succesfully deleted");

    

}
 catch(err){
       res.status(404).send("error"+err);

            }
}
const getproblembyid = async (req, res) => {
  try {
    const { id } = req.params;

    const getproblem = await problem
      .findById(id)
      .select("title description visibletestcases startcode");

    if (!getproblem) {
      return res.status(404).send("Problem not found");
    }

    return res.status(200).json(getproblem);

  } catch (err) {
    return res.status(500).send("Server error");
  }
};

const getallproblem = async (req, res) => {
  try {
    const problems = await problem
      .find({})
      .select("_id title tags startcode");

    if (problems.length === 0) {
      return res.status(200).send([]);
    }

    return res.status(200).json(problems);

  } catch (err) {
    console.error("Error in getallproblem:", err);
    return res.status(500).send("Server error");
  }
};

const submittedProblem = async (req, res) => {
  try {
    const userid = req.result._id;
    const problemid = req.params.pid;
 
    const submissions = await submission.find({ userid, problemid });
    
    if (submissions.length === 0) {
      return res.status(200).send("no submission");
    }
    
 
    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions: submissions
    });

  } catch (err) {
    console.error("Error in submittedProblem:", err);
    res.status(500).send("internal server error");
  }
}
const solvedallproblemuser=async(req,res)=>{
  try{
         
          const userid=req.result._id;

          const user=await User.findById(userid).populate({
            path:"problemsolved",
            select:"_id title difficulty tags"
          })
          return res.status(201).send(user);
  }
  catch(err){
    res.status(500).send("server issue");
  }
}
module.exports = {createproblem,updateproblem,deleteproblem,getproblembyid,getallproblem,solvedallproblemuser,submittedProblem};