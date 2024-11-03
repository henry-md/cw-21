import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1),
});

export const updatePostSchema = createPostSchema.partial();

export const getPostSchema = z.object({
  id: z.coerce.number().int().positive(),
});