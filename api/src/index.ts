import { Hono } from "hono";
import { cors } from "hono/cors";
import postRoutes from "./routes/posts.js";

const app = new Hono();

// Enable CORS
app.use("/*", cors());

// Mount routes
app.route("/api", postRoutes);

export default app; 