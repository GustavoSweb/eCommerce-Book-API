import database from "../database/connection.js";
import { NotValid, NotExistValue } from "../utils/Error.js";

class Products {
  async findOne(OneDate) {
    if (!OneDate) throw new NotValid("Missing parameters in findOne.");

    const key = Object.keys(OneDate);
    try {
      const data = await database
        .select()
        .table("products")
        .where(`${key[0]}`, OneDate[key[0]]);

      if (data.length > 0) return data[0];
      return undefined;
    } catch (err) {
      console.error(`Error finding product, findOne: ${err}`);
      throw new Error("An error occurred while retrieving the product.");
    }
  }

  async findById(id) {
    if (!id) throw new NotValid("Missing parameters in findById.");

    try {
      const data = await database.select().table("products").where({ id });

      if (data.length === 0) throw new NotExistValue("Product not found.");
      return data[0];
    } catch (err) {
      console.error(`Error finding product by ID: ${err}`);
      throw new Error("An error occurred while retrieving the product by ID.");
    }
  }

  async findAll() {
    try {
      const data = await database.select().table("products");
      return data;
    } catch (err) {
      console.error(`Error finding all products: ${err}`);
      throw new Error(
        "An error occurred while retrieving the list of products."
      );
    }
  }

  async create({
    user_id,
    url_banner_product,
    title,
    description,
    price,
    is_physical,
    stock,
    file_url,
    cod_product,
  }) {
    try {
      if (is_physical !== "0" && is_physical !== "1")
        throw new NotValid(
          "Invalid physical product value. It should be '0' or '1'."
        );

      await database
        .insert({
          user_id,
          url_banner_product,
          title,
          description,
          price,
          is_physical,
          stock,
          cod_product,
          file_url,
        })
        .into("products");
    } catch (err) {
      console.error(`Error creating product: ${err}`);
      throw new Error("An error occurred while creating the product.");
    }
  }
}

export default new Products();
