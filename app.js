const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const authRouter = require("./routes/authRouter");
const listRouter = require("./routes/listRouter");

require("dotenv").config();

const app = express();

app.listen(process.env.PORT, (err) =>
  err
    ? console.error(err)
    : console.log(`Server working on port ${process.env.PORT}...`)
);

mongoose
  .connect(process.env.TOKEN_DB)
  .then(() => console.log("DB is connected..."))
  .catch((err) => console.error(err));

app.use(express.json());
app.use("/auth", authRouter);
app.use("/list", listRouter);
app.use("/", express.static(path.join(__dirname, "client", "build")));

app.get("*", async (req, res) => {
  try {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  } catch (err) {
    console.error(err);
  }
});
