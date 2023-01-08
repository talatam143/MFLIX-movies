import express from "express";
import dotEnv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import detailsRoutes from "./Routes/routes.js";

const app = express();
dotEnv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

mongoose.connect(process.env.MONGOGB_URL, (err, db) => {
  if (!err) {
    console.log("Database connected successfully.");
  } else {
    console.log(err);
  }
});



app.use("/", detailsRoutes);

app.listen(process.env.PORT, (err) => {
  if (!err) {
    console.log("Sever started successfully on port " + process.env.PORT);
  } else {
    console.log(err);
  }
});
