import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import articlesRoutes from "./routes/articles.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/articles", articlesRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`✅ Running on http://localhost:${port}`);
});
