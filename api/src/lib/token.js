import jwt from "jsonwebtoken";

export function generateToken(user_id, user_type = 'jobseeker') {
  return jwt.sign(
    { 
      sub: user_id,
      user_type: user_type 
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}
