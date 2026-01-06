export type Role = "user" | "admin";

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  tags: string[];
  featured: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};
