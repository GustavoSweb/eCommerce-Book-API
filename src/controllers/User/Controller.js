import PasswordToken from "../../models/PasswordToken.js";
import User from "../../models/User.js";
import Validation from "../../utils/Validation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class UserController {
  async Login(req, res) {
    const JWTpassword = process.env.JWT_SECRET;
    const { email, password } = req.body;
    try {
      await new Validation({ email, password }).Check();
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ err: "User not found" });
      const resul = await bcrypt.compare(password, user.password);
      if (!resul) return res.status(400).json({ err: "Invalid credentials" });
      const token = jwt.sign({ role: user.role, email }, JWTpassword, {
        expiresIn: "72h",
      });
      if (!token) return res.sendStatus(500);
      res.status(200).json({ token });
    } catch (err) {
      console.error(`Error logging in: ${err}`);
      res.sendStatus(500);
    }
  }

  async DeleteUser(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        console.error("Invalid parameters");
        return res.status(400).json({ err: "Invalid parameters" });
      }
      await User.delete({ id });
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      if (err.status) {
        console.error(`Error deleting user: ${err.message}`);
        return res.status(err.status).json({ err: err.message });
      }
      console.error(`Error deleting user: ${err}`);
      res.sendStatus(500);
    }
  }

  async GetUsers(req, res) {
    try {
      const data = await User.findAll();
      res.status(200).json(data);
    } catch (err) {
      console.error(`Error fetching users: ${err}`);
      res.sendStatus(500);
    }
  }

  async CreateUser(req, res) {
    const { name, email, password } = req.body;
    try {
      await new Validation({ name, email, password }).Check();
      const userExist = await User.findOne({ email });
      if (userExist) {
        console.error("User already exists");
        return res.status(409).json({ err: "User already exists" });
      }
      const userCreated = await User.create({ name, email, password });
      res
        .status(200)
        .json({ message: "Success. User created.", user: userCreated });
    } catch (err) {
      if (err.status) {
        console.error(`Error creating user: ${err.message}`);
        return res.status(err.status).json({ err: err.message });
      }
      console.error(`Error creating user: ${err}`);
      res.sendStatus(500);
    }
  }

  async FindUser(req, res) {
    const { id } = req.params;
    try {
      let data = {};
      if (id === "me") {
        data = await User.findOne({ email: req.email });
      } else {
        data = await User.findById(id);
      }
      if (data) return res.status(200).json(data);
      return res.status(404).json({});
    } catch (err) {
      console.error(`Error fetching user: ${err}`);
      res.sendStatus(500);
    }
  }

  async UpdateUser(req, res) {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name && !email) {
      console.error("Missing parameters");
      return res.status(400).json({ err: "Missing parameters" });
    }
    try {
      await User.update({ id, data: { name, email } });
      res.status(200).json({ message: "User updated" });
    } catch (err) {
      if (err.name === "NotExistValue") {
        console.error(`User not found: ${err.message}`);
        return res.status(404).json({ err: err.message });
      }
      if (err.name === "NotValid") {
        console.error(`Invalid data: ${err.message}`);
        return res.status(400).json({ err: err.message });
      }
      console.error(`Error updating user: ${err}`);
      res.sendStatus(500);
    }
  }

  async ChangePassword(req, res) {
    try {
      const { token, password } = req.body;
      await new Validation({ token, password }).Check();

      const data = await PasswordToken.validate({ token });
      await User.changePassword({ token, password, id: data[0].user_id });

      res.status(200).json({ message: "Password changed" });
    } catch (err) {
      console.error(`Error changing password: ${err}`);
      if (err.name === "NotExistValue") {
        return res.status(404).json({ err: err.message });
      }
      if (err.name === "NotValid") {
        return res.status(400).json({ err: err.message });
      }
      res.sendStatus(500);
    }
  }

  async GetInfoUser(req, res) {
    const { email } = req.body.LogedUser;
    try {
      const data = await User.findOne({ email });
      res.json(data);
    } catch (err) {
      console.error(`Error fetching user info: ${err}`);
      res.sendStatus(500);
    }
  }

  validate(req, res) {
    res.send("Okay");
  }
}

export default new UserController();
