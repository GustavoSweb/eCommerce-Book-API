import Products from "../../models/Products.js";
import Validation from "../../utils/Validation.js";
import { v4 as uuidv4 } from "uuid";

class ProductController {
  async GetProducts(req, res) {
    try {
      const data = await Products.findAll();
      res.status(200).json(data);
    } catch (err) {
      console.error(`Error getting products: ${err}`);
      res.sendStatus(500);
    }
  }

  async GetOneProducts(req, res) {
    try {
      const { id } = req.params;
      const data = await Products.findById(id);
      res.status(200).json(data);
    } catch (err) {
      console.error(`Error getting product by ID: ${err}`);
      res.sendStatus(500);
    }
  }

  async CreateProducts(req, res) {
    const {
      user_id,
      url_banner_product,
      title,
      description,
      price,
      is_physical,
      stock,
      file_url,
    } = req.body;

    try {
      const cod_product = uuidv4();
      await new Validation({
        user_id,
        url_banner_product,
        title,
        description,
        price,
        stock,
        file_url,
      }).Check();

      const product_created = await Products.create({
        user_id,
        url_banner_product,
        title,
        description,
        price,
        is_physical,
        stock,
        cod_product,
      });

      res.status(200).json({
        message: "Success. Product created.",
        product: product_created,
      });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ err: err.message });
      }
      console.error(`Error creating product: ${err}`);
      res.sendStatus(500);
    }
  }
}

export default new ProductController();
