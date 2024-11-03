import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(120, "Content must be 120 characters or less"),
});

export const updateCommentSchema = createCommentSchema.partial();

export const getCommentsSchema = z.object({
  postId: z.coerce.number().int().positive(),
});

export const getCommentSchema = z.object({
  postId: z.coerce.number().int().positive(),
  commentId: z.coerce.number().int().positive(),
});