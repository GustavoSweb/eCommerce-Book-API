import express from "express";
import Products from "../controllers/Products/Controller.js";
// import AuthAdmin from "../middlewares/AuthAdmin.js";
// import AuthUser from "../middlewares/AuthUser.js";

const Router = express.Router();

Router.get("/products", Products.GetProducts);
Router.get("/products/:id", Products.GetOneProducts);
Router.post("/products", Products.CreateProducts);

export default Router;
