const mongoose = require("mongoose");

const db = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is connected succesfully!");
  } catch (error) {
    console.log("MongoDB is not connected.");
  }
};

module.exports = { db };
