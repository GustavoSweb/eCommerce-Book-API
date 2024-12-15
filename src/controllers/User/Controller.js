import PasswordToken from "../../models/PasswordToken.js";
import User from "../../models/User.js";
import Validation from "../../utils/Validation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Classroom from "../../models/Classroom.js";
import { ConflictData, NotExistValue, NotValid } from "../../utils/Error.js";

class UserController {
  async Login(req, res) {
    const JWTpassword = process.env.JWT_SECRET;
    const { email, password } = req.body;
    try {
      await new Validation({ email, password }).Check();
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ err: "Usuario não existe" });
      const resul = await bcrypt.compare(password, user.password);
      if (!resul) return res.status(400).json({ err: "Credenciais invalidas" });
      const token = jwt.sign({ role: user.role, email }, JWTpassword, {
        expiresIn: "72h",
      });
      if (!token) return res.sendStatus(500);
      res.status(200).json({ token });
    } catch (err) {
      console.log(err)
      res.sendStatus(500);
    }
  }
  async DeleteUser(req, res) {
    const { id } = req.params;
    try {
      if(!id) throw new NotValid('Parametros invalidos')
      await User.delete({ id });
      res.status(200).json({ message: "Usuario deletado" });
    } catch (err) {
      if(err.status) return res.status(err.status).json({err:err.message})
      res.sendStatus(500);
    }
  }
  async GetUsers(req, res) {
    try {
      const data = await User.findAll();
      res.status(200).json(data);
    } catch (err) {
      res.sendStatus(500);
    }
  }
  async CreateUser(req, res) {
    const { name, email, password, school_id,  classroom_id} = req.body;
    try {
      await new Validation({ name, email, password, school_id, classroom_id }).Check();
      const classroom = await Classroom.findById(classroom_id)
      if(!classroom) throw new NotExistValue('Não existe está sala no banco de dados')
      const User_Exist = await User.findOne({email})
    if(User_Exist) throw new ConflictData('Usuario ja cadastrado')
      await User.create({ name, email, password, school_id,  classroom_id });
      const User_Created = await User.findOne({email})
      res.status(200).json({ message: "Sucesso. Usuario cadastrado", user:User_Created });
    } catch (err) {
      if(err.status) return res.status(err.status).json({err:err.message})
      res.sendStatus(500);
    }
  }
  async FindUser(req, res) {
    const { id } = req.params;
    try {
      var data = {};
      if (id == "me") {
        data = await User.findOne({ email: req.email });
      } else data = await User.findById(id);

      if (data) return res.status(200).json(data);
      return res.status(404).json({});
    } catch (err) {
      res.sendStatus(500);
    }
  }
  async UpdateUser(req, res) {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name && !email)
      return res.status(400).json({ err: "Falta de parametros" });
    try {
      await User.update({ id, data: { name, email } });
      res.status(200).json({ message: "User Update" });
    } catch (err) {
      if (err.name == "NotExistValue")
        return res.status(404).json({ err: err.message });
      if (err.name == "NotValid")
        return res.status(400).json({ err: err.message });
      res.sendStatus(500);
    }
  }
  async ChangePassword(req, res) {
    try {
      const { token, password } = req.body;
      await new Validation({ token, password }).Check();

      const data = await PasswordToken.validate({ token });
      await User.chengePassword({ token, password, id: data[0].user_id });

      res.status(200).json({ message: "Password change" });
    } catch (err) {
      console.log(err);
      if (err.name == "NotExistValue")
        return res.status(404).json({ err: err.message });
      if (err.name == "NotValid")
        return res.status(400).json({ err: err.message });
      res.sendStatus(500);
    }
  }
  async GetInfoUser(req, res){
    console.log(req.body)

    const {email} = req.body.LogedUser
    try{
      const data = await User.findOne({email})
      res.json(data)
    }catch(err){
      res.sendStatus(500)
    }
  }
  validate(req, res){
    res.send('Okay')
  }
}

export default new UserController();
