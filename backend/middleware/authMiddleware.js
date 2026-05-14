import jwt from "jsonwebtoken";

function getJwtSecret() {
  if (!process.env.ADMIN_JWT_SECRET) {
    throw new Error("ADMIN_JWT_SECRET is missing. Add it to backend/.env before using admin authentication.");
  }

  return process.env.ADMIN_JWT_SECRET;
}

export function requireAdminAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Admin authentication required." });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    req.admin = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired admin token." });
  }
}
