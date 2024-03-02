// const express = require("express");

const Joi = require("joi");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");

const path = require("path");

const fs = require("fs/promises");

const Jimp = require("jimp");

const { nanoid } = require("nanoid");
// const { v4: uuidv4 } = require("uuid");

const UserSchema = require("../models/User");

const { RequestError, sendMail } = require("../helper");

const { upload } = require("../middlwares");

const { SECRET_KEY } = process.env;

// const router = express.Router();

const userRegisterSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const userLoginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().required(),
});

// router.post("/users/signup",
exports.signUp = async (req, res, next) => {
  try {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      throw RequestError(400, "Error from Joi or another validation library");
    }

    const { name, email, password, subscription } = req.body;
    const user = await UserSchema.findOne({ email });
    if (user) {
      throw RequestError(409, "This email is already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    // const verificationToken = uuidv4();

    const verificationToken = nanoid();

    await UserSchema.create({
      name,
      email,
      password: hashPassword,
      subscription,
      avatarURL,
      verificationToken,
    });

    const mail = {
      to: email,
      subject: "Site registration confirmation",
      html: `<a target="_blank" href="http://localhost:10000/api/v1/users/verify/:${verificationToken}">Verify Email</a>`,
    };

    await sendMail(mail);
    res.status(201).json({
      status: "Created",
      code: 201,
      data: {
        user: {
          name,
          email,
          subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// router.post("/users/login",
exports.login = async (req, res, next) => {
  try {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      throw RequestError(400, "Error from Joi or another validation library");
    }

    const { email, password } = req.body;
    const user = await UserSchema.findOne({ email });

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!user || !passwordCompare) {
      throw RequestError(401, "Email or password is wrong");
    }
    if (!user || !passwordCompare) {
      throw RequestError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    await UserSchema.findByIdAndUpdate(user._id, { token });

    res.json({
      status: "Success",
      code: 200,
      data: {
        token,
        user: {
          email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// router.post("/users/logout",
exports.logout = async (req, res, next) => {
  try {
    const { _id } = req.user;

    await UserSchema.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json({ message: "No content" });
  } catch (error) {
    console.error("Error during logout:", error);

    next(error);
  }
};

// router.get("/users/current",
exports.currentUser = (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

// router.get("/users/verify/:verificationToken",
exports.userVerifyToken = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await UserSchema.findOne({ verificationToken });
    if (!user) {
      throw RequestError(404, "Not Found");
    }

    await UserSchema.findByIdAndUpdate(user._id, {
      verificationToken: "",
      verify: true,
    });
    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

// router.post("/users/verify",
exports.userVerify = async (req, res, next) => {
  try {
    const { error } = verifyEmailSchema.validate(req.body);
    if (error) {
      throw RequestError(400, "Missing required field email");
    }

    const { email } = req.body;
    const user = await UserSchema.findOne({ email });
    if (!user) {
      throw RequestError(400, "Verification has already been passed");
    }

    const mail = {
      to: email,
      subject: "Site registration confirmation",
      html: `<a target="_blank" href="http://localhost:10000/api/v1/users/:${user.verificationToken}">Verify Email</a>`,
    };

    await sendMail(mail);
    res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

// router.patch(
//   "/users/avatars",
exports.uploadAvatars = upload.single("avatar");
async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tmpUpload } = req.file;
    const extention = tmpUpload.split(".").pop();

    const newAvatar = `${String(_id)}.${extention}`;

    const avatarURL = path.join("avatars", newAvatar);
    const resultUpload = path.join(avatarsDir, newAvatar);

    (await Jimp.read(tmpUpload)).resize(250, 250).writeAsync(tmpUpload);

    console.log(tmpUpload, resultUpload);
    await fs.rename(tmpUpload, resultUpload);

    const result = await User.findByIdAndUpdate(
      _id,
      { avatarURL },
      { returnDocument: "after" }
    );
    res.status(200).json({ avatarURL: result.avatarURL });
  } catch (error) {
    next(error);
  }
};
