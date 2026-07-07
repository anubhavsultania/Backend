import { z } from "zod";

export const titleSchema = z.object({
  title: z.string().trim().min(1).max(100),
});

export const idSchema = z.object({
    id: z.coerce.number().int().positive()
});