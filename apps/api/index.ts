import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

import auth from "./routes/auth";
import portfolio from "./routes/portfolio";
import clientAccessKey from "./routes/client-access";
import client from "./routes/client/";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://portfolio-system-55xb.vercel.app",
      "https://portfolio-system-caxn.vercel.app"
    ],
    credentials: true,
  })
);

app.route("/auth", auth);
app.route("/portfolio", portfolio);

app.route(
  "/clients",
  client
);
app.route(
  "/client-access",
  clientAccessKey
);

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