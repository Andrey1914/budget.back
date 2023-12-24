const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const db = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB is connected succesfully!");
  } catch (error) {
    console.log("MongoDB is not connected.");
  }
};

module.exports = { db };
