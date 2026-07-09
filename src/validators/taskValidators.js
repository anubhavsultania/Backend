import { z } from "zod";

export const titleSchema = z.object({
  title: z.string().trim().min(1).max(100),
});

export const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const getTasksSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  completed: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  projectId: z.coerce.number().int().positive().optional(),
  sort: z.enum(["completed", "title"]).default("title"),
  order: z.enum(["asc", "desc"]).default("asc"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(5),
});
