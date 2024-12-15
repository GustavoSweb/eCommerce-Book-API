import database from "../database/connection.js";
import { NotValid, NotExistValue, ConflictData } from "../utils/Error.js";
import PasswordToken from "../models/PasswordToken.js";
import bcrypt from "bcrypt";
class User {
  async delete({ id }) {
    try {
      const value = await database.where({ id }).delete().table("users");
      if (value == 0)
        throw new NotExistValue("O usuario a ser deletado não existe");
    } catch (err) {
      throw err;
    }
  }
  async findOne(OneDate) {
    if (!OneDate) throw new Error("Falta de parametros no findOne");
    const key = Object.keys(OneDate);
    try {
      const data = await database
        .select()
        .table("users")
        .where(`${key[0]}`, OneDate[key[0]]);
      if (data) return data[0];
      return undefined;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
  async updateProcessEdit(data, user) {
    try {
      if (user.email != data.email && data.email) {
        var emailRegister = await this.findOne({ email: data.email });
        if (emailRegister)
          throw new ConflictData("O e-mail ja esta registrado");
      } else delete data.email;
      if (!data.name || data.name == user.name) delete data.name;
      if (Object.keys(data).length <= 0)
        throw new NotValid("Não houve nenhuma modificação");
      return data;
    } catch (err) {
      throw err;
    }
  }
  async update({ data, id }) {
    try {
      const user = await this.findById(id);
      if (!user) throw new NotExistValue("Usuario não encontrado");
      const userEdit = await this.updateProcessEdit(data, user);
      return await database.update(userEdit).where({ id }).table("users");
    } catch (err) {
      throw err;
    }
  }
  async findById(id) {
    if (!id) throw new Error("Falta de parametros no findByPk");
    try {
      const data = await database
        .select(["id", "name", "email", "role"])
        .table("users")
        .where({ id });
      return data[0];
    } catch (err) {
      console.error(err);
      return {};
    }
  }
  async findAll() {
    try {
      const data = await database
        .select(["id", "name", "email", "role"])
        .table("users");
      return data;
    } catch (err) {
      throw err;
    }
  }
  async create({ name, email, password }) {
    try {
      const user = await this.findOne({ email });
      if (user) throw new ConflictData("Usuario ja esta cadastrado");
      var hash = await bcrypt.hash(password, 10);
      await database.insert({ name, email, password: hash }).into("users");
    } catch (err) {
      throw err;
    }
  }
  async chengePassword({ password, id }) {
    try {
      password = await bcrypt.hash(password, 10);
      const user = await database
        .update({ password })
        .where({ id })
        .table("users");
      if (user[0] <= 0) throw new NotExistValue("Usuario não existe");
      await PasswordToken.AlterStatus({ token });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default new User();
