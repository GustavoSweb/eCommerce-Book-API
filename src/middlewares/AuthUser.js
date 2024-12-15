import jwt from 'jsonwebtoken'
const JWTpassword = process.env.JWT_SECRET;

export default async (req, res, next) => {
  const authToken = req.headers["authorization"];
  try {
    if (!authToken) return res.status(401).json({ err: "token invalido" });
    const token = authToken.split(" ")[1];
    const result = jwt.verify(token, JWTpassword);
    if (!result) res.sendStatus(401);
    req.LogedUser = { role: result.role, email: result.email };
    next();
  } catch (err) {
    if(err.name == 'TokenExpiredError') return res.status(401).json({err:err.message})
    res.sendStatus(500);
  }
};
