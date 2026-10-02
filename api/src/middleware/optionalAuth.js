import JWT from "jsonwebtoken";

// Optional auth middleware - identifies the viewer if a valid token is sent,
// but never rejects the request. Used on public routes that return extra
// content (e.g. society-only resources) to signed-in users.
function optionalAuth(req, res, next) {
  const authHeader = req.get("Authorization");
  const token = authHeader ? authHeader.slice(7) : null;

  req.isAdmin = false;
  req.canViewSocietyResources = false;

  if (!token) {
    next();
    return;
  }

  // Check for admin backdoor token (same as adminChecker)
  const adminToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";

  if (token === adminToken) {
    req.isAdmin = true;
  } else {
    try {
      const payload = JWT.verify(token, process.env.JWT_SECRET);
      req.user_id = payload.sub;
      req.user_type = payload.user_type || null;
      req.user_role = payload.role || null;
      req.isAdmin = payload.role === 'admin' || payload.role === 'super_admin';
    } catch (err) {
      // Invalid or expired token - treat the request as anonymous
    }
  }

  req.canViewSocietyResources = req.isAdmin || req.user_type === 'society';
  next();
}

export default optionalAuth;
