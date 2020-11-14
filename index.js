const express = require("express");
const Authroute = require("./routes/auth");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

app.use(express.json());
const PORT = process.env.PORT || 5000;

const DBURI = process.env.DB_URI;

mongoose
  .connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("Database connected Sucessfully"))
  .catch((err) => console.log(err));

app.use("/api", Authroute);

app.listen(PORT, () => {
  console.log("Server Started");
});
