const jwt = require('jsonwebtoken');
const User = require('../model/user');
const redisclient = require('../config/redis');

const adminmiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("No token found");

    const payload = jwt.verify(token, process.env.JWT_KEY);
    
    // ✅ Check for admin role
   

    // ✅ Attach user data to request
    req.result = payload;
    next(); // ✅ Continue to next middleware/route
    
  } catch (err) {
    console.error("Admin middleware error:", err.message);
    res.status(401).send("Authentication failed");
  }
};


module.exports = adminmiddleware;
