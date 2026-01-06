import { randomUUID } from "crypto";
import type { User, Article } from "../types.js";

export const db = {
  users: [] as User[],
  articles: [] as Article[],
};

export const newId = () => randomUUID();
export const now = () => new Date().toISOString();