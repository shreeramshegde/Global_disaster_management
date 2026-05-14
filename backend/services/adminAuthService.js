import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { hasServiceRoleKey, supabaseAdmin } from "../config/supabase.js";

function requireAdminClient() {
  if (!hasServiceRoleKey || !supabaseAdmin) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin authentication. Add it to backend/.env.");
  }

  if (!process.env.ADMIN_JWT_SECRET) {
    throw new Error("ADMIN_JWT_SECRET is required for admin authentication. Add it to backend/.env.");
  }
}

function sanitizeAdmin(admin) {
  return {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    created_at: admin.created_at
  };
}

function validateRegistrationPayload(payload = {}) {
  const errors = [];

  if (!String(payload.username || "").trim()) errors.push("username is required.");
  if (!String(payload.email || "").trim()) errors.push("email is required.");
  if (!String(payload.password || "").trim()) errors.push("password is required.");

  const email = String(payload.email || "").trim().toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("email must be a valid email address.");
  }

  if (String(payload.password || "").length < 8) {
    errors.push("password must be at least 8 characters.");
  }

  return errors;
}

function validateLoginPayload(payload = {}) {
  const errors = [];
  const identifier = String(payload.identifier || payload.username || payload.email || "").trim();

  if (!identifier) errors.push("username or email is required.");
  if (!String(payload.password || "").trim()) errors.push("password is required.");

  return { errors, identifier };
}

function buildToken(admin) {
  return jwt.sign(
    {
      sub: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "12h" }
  );
}

async function findAdminByIdentifier(identifier) {
  const normalizedIdentifier = String(identifier || "").trim();
  const isEmail = normalizedIdentifier.includes("@");
  const column = isEmail ? "email" : "username";

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("id, username, email, password_hash, role, created_at")
    .eq(column, isEmail ? normalizedIdentifier.toLowerCase() : normalizedIdentifier)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load admin user: ${error.message}`);
  }

  return data;
}

export async function registerAdmin(payload) {
  requireAdminClient();

  const errors = validateRegistrationPayload(payload);
  if (errors.length) {
    const error = new Error(errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const username = String(payload.username || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const password_hash = await bcrypt.hash(String(payload.password), 12);

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .insert({
      username,
      email,
      password_hash,
      role: String(payload.role || "admin").trim() || "admin"
    })
    .select("id, username, email, role, created_at")
    .single();

  if (error) {
    const message = error.code === "23505"
      ? "Admin username or email already exists."
      : `Failed to create admin user: ${error.message}`;
    const insertError = new Error(message);
    insertError.statusCode = error.code === "23505" ? 409 : 500;
    throw insertError;
  }

  const token = buildToken(data);
  return { admin: sanitizeAdmin(data), token };
}

export async function loginAdmin(payload) {
  requireAdminClient();

  const { errors, identifier } = validateLoginPayload(payload);
  if (errors.length) {
    const error = new Error(errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const admin = await findAdminByIdentifier(identifier);
  if (!admin) {
    const error = new Error("Invalid admin credentials.");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(String(payload.password), admin.password_hash);
  if (!passwordMatches) {
    const error = new Error("Invalid admin credentials.");
    error.statusCode = 401;
    throw error;
  }

  return {
    admin: sanitizeAdmin(admin),
    token: buildToken(admin)
  };
}
