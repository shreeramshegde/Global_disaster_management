import express from "express";
import { loginAdmin, registerAdmin } from "../services/adminAuthService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const result = await registerAdmin(req.body);
    res.status(201).json({ message: "Admin account created successfully.", ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await loginAdmin(req.body);
    res.json({ message: "Admin login successful.", ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

export default router;
