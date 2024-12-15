import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import express from "express";
const app = express();

import UserRouter from "./routes/User.js";
import ProductsRouter from "./routes/Products.js";
import TokenRouter from "./routes/Tokens.js";

import cors from "cors";
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", UserRouter);
app.use("/", ProductsRouter);

(async (main) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (err) {
    console.error(err);
  }
})();

app.get("/", (req, res) => {
  res.send("Api TeflyClass");
});

export default app;
