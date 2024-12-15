import express from "express";
import User from "../controllers/User/Controller.js";
import AuthAdmin from "../middlewares/AuthAdmin.js";
import AuthUser from "../middlewares/AuthUser.js";

const Router = express.Router();

Router.get("/user", AuthAdmin, User.GetUsers);
Router.post("/user", User.CreateUser);
Router.get("/user/:id", AuthAdmin, User.FindUser);
Router.put("/user/:id", AuthAdmin, User.UpdateUser);
Router.delete("/user/:id", User.DeleteUser);
Router.put("/changepassword", AuthUser, User.ChangePassword);
Router.post("/login", User.Login);
Router.post("/user/me", AuthUser, User.GetInfoUser);
Router.post("/checkadmin", AuthAdmin, User.validate);

export default Router;
