import { Hono } from "hono";
import { db } from "../db";
import { posts } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  createPostSchema,
  updatePostSchema,
  getPostSchema,
} from "../validators/schemas";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

const postRoutes = new Hono();

// Get all posts
postRoutes.get("/posts", async (c) => {
  const allPosts = await db.select().from(posts);
  return c.json(allPosts);
});

// Get a single post by id
postRoutes.get("/posts/:id", zValidator("param", getPostSchema), async (c) => {
  const { id } = c.req.valid("param");
  const post = await db.select().from(posts).where(eq(posts.id, id)).get();
  if (!post) {
    throw new HTTPException(404, { message: "Post not found" });
  }
  return c.json(post);
});

// Delete a post by id
postRoutes.delete("/posts/:id", zValidator("param", getPostSchema), async (c) => {
  const { id } = c.req.valid("param");
  const deletedPost = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning()
    .get();
  if (!deletedPost) {
    throw new HTTPException(404, { message: "Post not found" });
  }
  return c.json(deletedPost);
});

// Create a new post
postRoutes.post("/posts", zValidator("json", createPostSchema), async (c) => {
  const { content } = await c.req.json();
  const newPost = await db
    .insert(posts)
    .values({
      content,
      date: new Date(),
    })
    .returning()
    .get();

  return c.json(newPost);
});

// Update a post by id
postRoutes.patch(
  "/posts/:id",
  zValidator("param", getPostSchema),
  zValidator("json", updatePostSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { content } = await c.req.json();
    const updatedPost = await db
      .update(posts)
      .set({ content })
      .where(eq(posts.id, id))
      .returning()
      .get();

    if (!updatedPost) {
      throw new HTTPException(404, { message: "Post not found" });
    }
    return c.json(updatedPost);
  }
);

export default postRoutes; 