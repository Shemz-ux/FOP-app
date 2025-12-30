import jwt from "jsonwebtoken";

export function generateToken(user_id, user_type = 'jobseeker', role = null) {
  const payload = { 
    sub: user_id,
    user_type: user_type 
  };
  
  // Add role if provided (for admin users)
  if (role) {
    payload.role = role;
  }
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}
