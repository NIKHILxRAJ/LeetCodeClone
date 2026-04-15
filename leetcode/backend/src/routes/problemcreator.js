//create fetch delete update
const express=require('express');
const problemrouter=express.Router();
const adminmiddleware=require('../middleware/adminmiddleware');
const {createproblem,updateproblem,deleteproblem,getproblembyid,getallproblem,solvedallproblemuser,submittedProblem}=require("../controller/userproblem");
const usermiddleware=require("../middleware/usermiddleware")
problemrouter.post("/create",adminmiddleware,createproblem);
problemrouter.put('/update/:id', adminmiddleware, updateproblem);

problemrouter.delete('/delete/:id', adminmiddleware, deleteproblem);

problemrouter.get('/problemById/:id',usermiddleware, getproblembyid);

problemrouter.get('/getAllProblem',usermiddleware, getallproblem);
problemrouter.get('/submittedProblem/:pid' ,usermiddleware, submittedProblem);

problemrouter.get('/problemSolvedByUser',usermiddleware, solvedallproblemuser);

module.exports=problemrouter;
