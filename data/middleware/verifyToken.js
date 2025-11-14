const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function verifytoken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied" });
  try {
    const splittoken = token.split(" ")
    const decoded = jwt.verify(splittoken[1],process.env.SECRET_KEY)
    req.userId = decoded.userid;
      next();
  } catch (err) {
    return res.status(401).json({ error: "Session ended" });
  }
}
module.exports = verifytoken;
