import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index.js";
import { posts } from "../db/schema.js";
import { eq, asc, desc, like, count, SQL, and } from "drizzle-orm";

const postRoutes = new Hono();

// Define query parameters schema
const queryParamsSchema = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

// Get all posts with optional sorting, filtering, searching, and pagination
postRoutes.get("/posts", zValidator("query", queryParamsSchema), async (c) => {
  const { sort, search, page = 1, limit = 10 } = c.req.valid("query");

  const whereClause: (SQL | undefined)[] = [];
  if (search) {
    whereClause.push(like(posts.content, `%${search}%`));
  }

  const orderByClause: SQL[] = [];
  if (sort === "desc") {
    orderByClause.push(desc(posts.date));
  } else if (sort === "asc") {
    orderByClause.push(asc(posts.date));
  }

  const offset = (page - 1) * limit;

  const [allPosts, [{ totalCount }]] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(and(...whereClause))
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset),
    db
      .select({ totalCount: count() })
      .from(posts)
      .where(and(...whereClause)),
  ]);

  return c.json({
    posts: allPosts,
    page,
    limit,
    total: totalCount,
  });
});

export default postRoutes; 