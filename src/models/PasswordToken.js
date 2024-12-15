import database from '../database/connection.js'
import User from './User.js'
import { NotExistValue } from '../utils/Error.js';
import {v4 as uuidv4} from 'uuid'
class PasswordToken {
  async create({ email }) {
    try {
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) throw new NotExistValue("Não a nenhum usuario com este e-mail");
      const token = uuidv4();
      await database.insert({ user_id: user.id, token }).into("passwordtokens");
      return token;
    } catch (err) {
      throw err;
    }
  }
  async validate({ token }) {
    try {
      const data = await database.where({ token }).table("passwordtokens");
      if (data.lenght <= 0)
        throw new NotExistValue("Este token não existe da base de dados");
      if (data[0].used == 1) throw new NotExistValue("Este token está expirado!");
      console.log(data)
      return data;
    } catch (err) {
      throw err;
    }
  }
  async AlterStatus({token}){
    try{
    const value = await database.where({token}).update({used:1}).table('passwordtokens')
    if(value == 0) throw new NotExistValue('Este token não existe')
    }catch(err){
  throw err
    }
  }
}
export default new PasswordToken();
