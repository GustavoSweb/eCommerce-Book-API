import database from "../database/connection.js";
import { NotValid, NotExistValue, ConflictData } from "../utils/Error.js";
import bcrypt from "bcrypt";
class User {
  async delete({ id }) {
    try {
      const value = await database.where({ id }).delete().table("users");
      if (value == 0)
        throw new NotExistValue("The user to be deleted does not exist.");
    } catch (err) {
      console.error(`Error deleting user: ${err}`);
      throw new Error("An error occurred while deleting the user.");
    }
  }

  async findOne(OneDate) {
    if (!OneDate) throw new Error("Missing parameters in findOne.");
    const key = Object.keys(OneDate);
    try {
      const data = await database
        .select()
        .table("users")
        .where(`${key[0]}`, OneDate[key[0]]);
      return data[0] ? data[0] : undefined;
    } catch (err) {
      console.error(`Error finding user, findOne: ${err}`);
      throw new Error(
        "An error occurred while retrieving the user in findOne."
      );
    }
  }

  async updateProcessEdit(data, user) {
    try {
      if (user.email != data.email && data.email) {
        var emailRegister = await this.findOne({ email: data.email });
        if (emailRegister)
          throw new ConflictData("The email is already registered.");
      } else delete data.email;
      if (!data.name || data.name == user.name) delete data.name;
      if (Object.keys(data).length <= 0)
        throw new NotValid("No modification was made.");
      return data;
    } catch (err) {
      console.error(`Error formatting and verifying edit: ${err}`);
      throw new Error("An error occurred while verifying the user's edit.");
    }
  }

  async update({ data, id }) {
    try {
      const user = await this.findById(id);
      if (!user) throw new NotExistValue("User not found.");
      const userEdit = await this.updateProcessEdit(data, user);
      return await database.update(userEdit).where({ id }).table("users");
    } catch (err) {
      console.error(`Error updating user: ${err}`);
      throw new Error("An error occurred while updating the user.");
    }
  }

  async findById(id) {
    if (!id) throw new Error("Missing parameters in findByPk.");
    try {
      const data = await database
        .select(["id", "name", "email", "role"])
        .table("users")
        .where({ id });
      return data.length > 0 ? data[0] : {};
    } catch (err) {
      console.error(`Error finding user, findById: ${err}`);
      throw new Error("An error occurred while retrieving the user.");
    }
  }

  async findAll() {
    try {
      const data = await database
        .select(["id", "name", "email", "role"])
        .table("users");
      return data;
    } catch (err) {
      console.error(`Error finding users: ${err}`);
      throw new Error("An error occurred while retrieving the list of users.");
    }
  }

  async create({ name, email, password }) {
    try {
      const user = await this.findOne({ email });
      if (user) throw new ConflictData("User is already registered.");
      var hash = await bcrypt.hash(password, 10);
      await database.insert({ name, email, password: hash }).into("users");
    } catch (err) {
      console.error(`Error creating user: ${err}`);
      throw new Error("An error occurred while creating the user.");
    }
  }
}

export default new User();
