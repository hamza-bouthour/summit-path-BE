import { Router } from "express";
import { z } from "zod";
import { db, newId, now } from "../db/memory.js";
import { requireAuth, requireAdmin, AuthedRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ items: db.articles });
});

router.get("/:id", (req, res) => {
  const article = db.articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: "Not found" });
  res.json({ item: article });
});

router.post("/", requireAuth, requireAdmin, (req: AuthedRequest, res) => {
  const schema = z.object({
    title: z.string(),
    excerpt: z.string(),
    content: z.string(),
    category: z.string(),
    coverImage: z.string().optional().default(""),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const article = {
    id: newId(),
    ...parsed.data,
    authorId: req.user!.id,
    createdAt: now(),
    updatedAt: now(),
  };

  db.articles.push(article);
  res.status(201).json({ item: article });
});

router.put("/:id", requireAuth, requireAdmin, (req, res) => {
  const article = db.articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: "Not found" });

  Object.assign(article, req.body, { updatedAt: now() });
  res.json({ item: article });
});

router.delete("/:id", requireAuth, requireAdmin, (req, res) => {
  db.articles = db.articles.filter(a => a.id !== req.params.id);
  res.json({ ok: true });
});

export default router;
