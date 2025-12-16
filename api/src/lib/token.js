import jwt from "jsonwebtoken";

export function generateToken(user_id) {
  return jwt.sign(
    { sub: user_id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}
