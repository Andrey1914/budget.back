require("dotenv").config();

const { LOCALHOST, HOSTING } = process.env;

const corsOptions = {
  origin: LOCALHOST || HOSTING,
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

module.exports = corsOptions;
