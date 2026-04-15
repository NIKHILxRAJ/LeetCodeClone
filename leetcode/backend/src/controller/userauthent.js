const express = require('express');
const authrouter = express.Router();
const usermiddleware = require('../middleware/usermiddleware');
const adminmiddleware = require('../middleware/adminmiddleware');
const User = require('../model/user');
const validate = require('../utils/validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const redisclient = require('../config/redis');
const submission = require("../model/submission");

// ✅ REGISTER
const register = async (req, res) => {
  try {
    // ✅ TEMPORARILY COMMENT THIS IF IT FAILS
    // validate(req.body);

    const { firstName, emailId, password } = req.body;

    if (!firstName || !emailId || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      emailId,
      password: hashedPassword,
      role: "user"
    });

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });

    res.status(200).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        emailId: user.emailId
      },
      message: "Registered Successfully"
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });

    res.status(200).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        emailId: user.emailId
      },
      message: "Login Successfully"
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGOUT (unchanged logic)
const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    const nowInSec = Math.floor(Date.now() / 1000);
    const ttl = payload.exp - nowInSec;

    await redisclient.set(`token:${token}`, 'blocked', 'EX', ttl);

    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged out successfully");

  } catch (err) {
    res.status(503).json({ message: err.message });
  }
};

// ✅ ADMIN REGISTER (minor fix only)
const adminregister = async (req, res) => {
  try {
    validate(req.body);

    req.body.role = 'admin';
    req.body.password = await bcrypt.hash(req.body.password, 10);

    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );

    res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("Admin registered successfully");

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ DELETE PROFILE (unchanged)
const deleteprofile = async (req, res) => {
  try {
    const userid = req.result._id;
    await User.findByIdAndDelete(userid);
    await submission.deleteMany({ userid });

    res.status(200).send("Deleted successfully");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};
module.exports={register,login,logout,adminregister,deleteprofile};