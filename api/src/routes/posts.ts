import { Hono } from "hono";
import { db } from "../db/index.js";
import { posts } from "../db/schema.js";
import { eq } from "drizzle-orm";

const postsRouter = new Hono();

// GET all posts
postsRouter.get("/posts", async (c) => {
  try {
    const allPosts = await db.select().from(posts);
    return c.json(allPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

// GET a specific post by ID
postsRouter.get("/posts/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  try {
    const post = await db.select().from(posts).where(eq(posts.id, id)).get();
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json(post);
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return c.json({ error: "Failed to fetch post" }, 500);
  }
});

// POST a new post
postsRouter.post("/posts", async (c) => {
  const { content } = await c.req.json();
  try {
    const newPost = await db
      .insert(posts)
      .values({
        content,
        date: new Date(),
      })
      .returning()
      .get();
    return c.json(newPost, 201);
  } catch (error) {
    console.error("Error creating post:", error);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// PATCH (update) a post
postsRouter.patch("/posts/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const { content } = await c.req.json();
  try {
    const updatedPost = await db
      .update(posts)
      .set({ content })
      .where(eq(posts.id, id))
      .returning()
      .get();
    if (!updatedPost) {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json(updatedPost);
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    return c.json({ error: "Failed to update post" }, 500);
  }
});

// DELETE a post
postsRouter.delete("/posts/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  try {
    const deletedPost = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning()
      .get();
    if (!deletedPost) {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json(deletedPost);
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    return c.json({ error: "Failed to delete post" }, 500);
  }
});

export default postsRouter; 