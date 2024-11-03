import { Hono } from "hono";
import postsRoute from "./routes/posts.js";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/", postsRoute);

// Error handling
app.onError((err, c) => {
  console.error("Caught error:", err);
  
  if (err instanceof HTTPException) {
    return err.getResponse();
  } 
  
  return c.json(
    {
      message: "An unexpected error occurred",
    },
    500,
  );
});

export default app;
