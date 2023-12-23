const express = require("express");

const cors = require("cors");

const corsOptions = require("./corsOptions");

const { db } = require("./db/db");

const { readdirSync } = require("fs");

const app = express();

require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors(corsOptions));

readdirSync("./routes").map(
  (route) => app.use("/api/v1", require("./routes/" + route))
  // app.use(require("./routes/" + route))
);

const server = () => {
  db();
  app.listen(PORT, () => {
    console.log("listening to port:", PORT);
  });
};

server();
