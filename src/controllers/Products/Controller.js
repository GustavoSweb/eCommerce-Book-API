import Products from "../../models/Products.js";
import Validation from "../../utils/Validation.js";
import { ConflictData, NotExistValue, NotValid } from "../../utils/Error.js";

class UserController {
  async GetProducts(req, res) {
    try {
      const data = await Products.findAll();
      res.status(200).json(data);
    } catch (err) {
      res.sendStatus(500);
    }
  }
  async CreateProducts(req, res) {
    const { name, email, password } = req.body;
    try {
      await new Validation({
        name,
        email,
        password,
      }).Check();
      const User_Exist = await Products.findOne({ email });
      if (User_Exist) throw new ConflictData("Usuario ja cadastrado");
      const user_created = await Products.create({ name, email, password });
      res
        .status(200)
        .json({ message: "Sucesso. Usuario cadastrado", user: user_created });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ err: err.message });
      res.sendStatus(500);
    }
  }
}

export default new UserController();
