const jwt = require("jsonwebtoken");
const User = require("../model/userschema");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticate;
