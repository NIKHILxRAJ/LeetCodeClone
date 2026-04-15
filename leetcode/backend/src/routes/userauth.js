const express=require('express');
const authrouter=express.Router();
const usermiddleware=require('../middleware/usermiddleware');
const adminmiddleware=require('../middleware/adminmiddleware');
const {register,login,logout,adminregister,deleteprofile}=require('../controller/userauthent');
authrouter.post('/register', register);
authrouter.post('/login', login);
authrouter.post('/logout',usermiddleware, logout);
authrouter.post('/admin/register',adminmiddleware,adminregister);
authrouter.delete('/deleteprofile',usermiddleware,deleteprofile);
authrouter.get('/check', usermiddleware, (req, res) => {
    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id: req.result._id
    };

    res.status(200).json({
        user: reply,
        message: "Valid User"
    });
});

//authrouter.get('/getprofile', getprofile);
// Your other application routes
module.exports=authrouter;