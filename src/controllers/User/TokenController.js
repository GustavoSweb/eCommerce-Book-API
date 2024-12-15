import PasswordToken from "../../models/PasswordToken.js";

class TokenController {
  async CreateToken(req, res) {
    try {
      const { email } = req.body;
      if (!email)
        res.status(400).json({ err: "Não foi enviado o campo email" });
      const token = await PasswordToken.create({ email });
      res.status(200).json({token})
    } catch (err) {
      if (err.name == "ExistValue")
        return res.status(409).json({ err: err.message });
      res.sendStatus(500);
    }
  }
}

export default new TokenController();
