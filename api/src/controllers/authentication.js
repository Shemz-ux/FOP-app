import User from "../models/user.js";
import { generateToken } from "../lib/token.js";
import bcrypt from "bcrypt";

async function createToken(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });

  if (!user) {
    console.log("Auth Error: User not found");
    return res.status(401).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    console.log("Auth Error: Passwords do not match");
    return res.status(401).json({ message: "Password incorrect" });
  }
  const token = generateToken(user.id);
  return res.status(201).json({ token: token, user_id: user.id, message: "OK" });
}


const AuthenticationController = {
  createToken: createToken,
};

export default AuthenticationController;