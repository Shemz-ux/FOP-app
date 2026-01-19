import JWT from "jsonwebtoken";

// Admin backdoor middleware - checks for special admin token
function adminChecker(req, res, next) {
  let token;
  const authHeader = req.get("Authorization");

  console.log("🔐 Admin Checker - Auth Header:", authHeader ? "Present" : "Missing");

  if (authHeader) {
    token = authHeader.slice(7);
    console.log("🔐 Admin Checker - Token extracted:", token ? `${token.substring(0, 20)}...` : "Empty");
  } else {
    console.log("🔐 Admin Checker - No Authorization header");
  }

  // Check for admin backdoor token
  const adminToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";
  
  if (token === adminToken) {
    console.log("🔐 Admin Checker - Backdoor token accepted");
    req.isAdmin = true;
    next();
    return;
  }

  // If not admin token, check for regular JWT with admin role
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    const user_id = payload.sub;
    const role = payload.role;

    console.log("🔐 Admin Checker - JWT Payload:", { user_id, role, user_type: payload.user_type });

    if (!user_id) {
      console.log("🔐 Admin Checker - FAILED: No sub claim in JWT token");
      throw new Error("No sub claim in JWT token");
    }

    // Check if user has admin role (admin or super_admin)
    if (role !== 'admin' && role !== 'super_admin') {
      console.log("🔐 Admin Checker - FAILED: User role is not admin:", role);
      return res.status(403).json({ message: "Admin access required" });
    }

    console.log("🔐 Admin Checker - SUCCESS: Admin authenticated");
    req.user_id = user_id;
    req.isAdmin = true;
    next();
  } catch (err) {
    console.log("🔐 Admin Checker - ERROR:", err.message);
    res.status(401).json({ message: "Admin authentication required" });
  }
}

export default adminChecker;
