import express from "express";
import User from "../controllers/User/Controller.js";
import AuthAdmin from "../middlewares/AuthAdmin.js";
import AuthUser from "../middlewares/AuthUser.js";

const Router = express.Router();

Router.get("/products", User.GetUsers);
Router.post("/products", AuthAdmin, User.CreateUser);

export default Router;
