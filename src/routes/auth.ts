import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db, newId, now } from "../db/memory.js";
import { requireAuth, AuthedRequest } from "../middleware/auth.js";
import type { Role, User } from "../types.js";

const router = Router();

router.post("/register", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { email, name, password } = parsed.data;

  if (db.users.some(u => u.email === email)) {
    return res.status(409).json({ error: "Email already exists" });
  }

 const role: Role = db.users.length === 0 ? "admin" : "user";

const user: User = {
  id: newId(),
  email,
  name,
  passwordHash: await bcrypt.hash(password, 10),
  role,
  createdAt: now(),
};

  db.users.push(user);

  res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

router.post("/login", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const user = db.users.find(u => u.email === parsed.data.email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.get("/me", requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: req.user });
});

export default router;
