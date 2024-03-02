// const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "bussines"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    // verify: {
    //   type: Boolean,
    //   default: false,
    // },
    verificationToken: {
      type: String,
      require: [true, "Verify token is require"],
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", UserSchema);
