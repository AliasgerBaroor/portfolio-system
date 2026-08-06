import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

import auth from "./routes/auth";
import portfolio from "./routes/portfolio";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.route("/auth", auth);
app.route("/portfolio", portfolio);

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Portfolio Platform API 🚀",
  });
});

serve({
  fetch: app.fetch,
  port: 8000,
});