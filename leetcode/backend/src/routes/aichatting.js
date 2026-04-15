const express = require('express');
const airouter = express.Router();
const userMiddleware = require("../middleware/usermiddleware");
const { solvedoubt }=require("../controller/solvedoubt");

// Route to handle AI chatting/doubt solving
airouter.post('/chat', userMiddleware, solvedoubt);

module.exports = airouter;