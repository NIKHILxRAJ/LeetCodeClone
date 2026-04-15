const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECT_STRING);
  console.log("db connected");
};

module.exports = connectDB;
