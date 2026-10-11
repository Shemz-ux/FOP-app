import JWT from "jsonwebtoken";

/**
 * Only a logged-in society may continue, and it is identified by its token
 * rather than by anything in the URL.
 *
 * Routes guarded by this take no society id, so there is no parameter a caller
 * can change to read another society's data, and no ownership comparison to
 * get wrong. For societies the JWT subject is the society_id, set when the
 * token is issued in controllers/authentication.js.
 */
function societyChecker(req, res, next) {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Authentication required" });
  }

  const token = authHeader.slice(7);

  let payload;
  try {
    payload = JWT.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ msg: "Authentication required" });
  }

  if (!payload.sub) {
    return res.status(401).json({ msg: "Authentication required" });
  }

  if (payload.user_type !== "society") {
    return res.status(403).json({ msg: "Society access required" });
  }

  req.society_id = Number(payload.sub);
  req.user_type = payload.user_type;
  next();
}

export default societyChecker;
