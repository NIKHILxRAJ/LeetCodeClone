require('dotenv').config();
const jwt = require('jsonwebtoken');
const redisclient = require('../config/redis');




const middleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(400).send("No token found");
    
    if (!process.env.JWT_KEY) {
      return res.status(500).send("JWT secret key not configured");
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
   
    const isBlocked = await redisclient.get(`token:${token}`);
    if (isBlocked) return res.status(401).send("Token expired or blocked");

   
    req.result = payload;

    next();
  }  catch (err) {  
    console.error("JWT verification failed:", err.message);
    
    if (err.message === "secret or public key must be provided") {
      return res.status(500).send("JWT secret key not configured properly");
    }
    
    res.status(503).send("Error: " + err.message);
  } 
};
module.exports = middleware;
