import JWT from "jsonwebtoken";

// Middleware function to check for valid tokens
function tokenChecker(req, res, next) {
  let token;
  const authHeader = req.get("Authorization");

  if (authHeader) {
    token = authHeader.slice(7);
  }

  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    // console.log("JWT payload:", payload);
    const user_id = payload.sub

    if (!user_id) {
      throw new Error("No sub claim in JWT token");
    }
    // Add the user_id and user_type from the payload to the Express req object.
    req.user_id = user_id;
    req.user_type = payload.user_type || null;
    req.user_role = payload.role || null;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "auth error" });
  }
}

export default tokenChecker;
