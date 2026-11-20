import "dotenv/config";

import { serve } from "@hono/node-server";
import { prisma } from "./lib/prisma";
import app from "./app";

async function startServer() {
  try {
    console.log("[DB DEBUG] Connecting to database...");

    await prisma.$connect();

    console.log("[DB DEBUG] Prisma connected successfully");

    const result = await prisma.portfolio.findFirst();

    console.log("[DB DEBUG] Portfolio query test:", result);

    serve({
      fetch: app.fetch,
      port: 8000,
    });

    console.log("[API] Server running on port 8000");
  } catch (error) {
    console.error("[DB DEBUG] Startup connection failed:", error);
    process.exit(1);
  }
}

startServer();