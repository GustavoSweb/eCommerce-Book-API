import database from "../database/connection.js";
import { NotValid, NotExistValue, ConflictData } from "../utils/Error.js";
import PasswordToken from "../models/PasswordToken.js";
import bcrypt from "bcrypt";
class Products {
  async findOne(OneDate) {
    if (!OneDate) throw new Error("Falta de parametros no findOne");
    const key = Object.keys(OneDate);
    try {
      const data = await database
        .select()
        .table("products")
        .where(`${key[0]}`, OneDate[key[0]]);
      if (data) return data[0];
      return undefined;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
  async findById(id) {
    if (!id) throw new Error("Falta de parametros no findByPk");
    try {
      const data = await database.select().table("products").where({ id });
      return data[0];
    } catch (err) {
      console.error(err);
      return {};
    }
  }
  async findAll() {
    try {
      const data = await database.select().table("products");
      return data;
    } catch (err) {
      throw err;
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
      if (is_physical != "0" && is_physical != "1")
        throw new NotValid("Dados incorretos");
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
      throw err;
    }
  }
}

export default new Products();
