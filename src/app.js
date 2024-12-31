import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import express from "express";
const app = express();

import UserRouter from "./routes/User.js";
import ProductsRouter from "./routes/Products.js";

import cors from "cors";
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", UserRouter);
app.use("/", ProductsRouter);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (err) {
    console.error(err);
  }
})();

app.get("/", (req, res) => {
  res.send("Api ebook ngrok ");
});

export default app;
