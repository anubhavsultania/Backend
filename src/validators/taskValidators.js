import { z } from "zod";

export const searchTasksSchema = z.object({
  title: z.string().trim().min(1).max(100),
});
