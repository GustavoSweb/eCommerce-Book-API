import database from "../database/connection.js";
import User from "./User.js";
import { NotExistValue } from "../utils/Error.js";
import { v4 as uuidv4 } from "uuid";

class PasswordToken {
  async create({ email }) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new NotExistValue("No user found with this email.");
      const token = uuidv4();
      await database.insert({ user_id: user.id, token }).into("passwordtokens");
      return token;
    } catch (err) {
      console.error(`Error creating password token: ${err}`);
      throw new Error("An error occurred while generating the password token.");
    }
  }

  async validate({ token }) {
    try {
      const data = await database.where({ token }).table("passwordtokens");
      if (data.length <= 0) {
        throw new NotExistValue("This token does not exist in the database.");
      }
      if (data[0].used == 1) {
        throw new NotExistValue("This token has expired.");
      }
      return data;
    } catch (err) {
      console.error(`Error validating password token: ${err}`);
      throw new Error("An error occurred while validating the password token.");
    }
  }

  async alterStatus({ token }) {
    try {
      const value = await database
        .where({ token })
        .update({ used: 1 })
        .table("passwordtokens");
      if (value === 0) {
        throw new NotExistValue("This token does not exist.");
      }
    } catch (err) {
      console.error(`Error altering token status: ${err}`);
      throw new Error("An error occurred while updating the token status.");
    }
  }
}

export default new PasswordToken();
