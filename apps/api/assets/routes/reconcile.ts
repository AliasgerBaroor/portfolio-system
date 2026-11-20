import { timingSafeEqual } from "node:crypto";
import { Hono } from "hono";

import { reconcileAssetDeletions } from "../services/reconcile-asset-deletions.service";

const reconcile = new Hono();

function isAuthorized(token: string, secret: string): boolean {
    const tokenBuffer = Buffer.from(token);
    const secretBuffer = Buffer.from(secret);

    return (
        tokenBuffer.length === secretBuffer.length &&
        timingSafeEqual(tokenBuffer, secretBuffer)
    );
}

async function handleReconciliation(c: any) {
    const secret = process.env.CRON_SECRET;

    if (!secret) {
        console.error("CRON_SECRET is not configured.");

        return c.json({
            success: false,
            message: "Reconciliation is not configured.",
        }, 500);
    }

    const authorization = c.req.header("Authorization");
    const token = authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : "";

    if (!token || !isAuthorized(token, secret)) {
        return c.json({
            success: false,
            message: "Unauthorized.",
        }, 401);
    }

    try {
        const result = await reconcileAssetDeletions();

        return c.json({
            success: true,
            message: "Asset deletion reconciliation completed.",
            result,
        });
    } catch (error) {
        console.error("Asset deletion reconciliation error:", error);

        return c.json({
            success: false,
            message: "Asset deletion reconciliation failed.",
        }, 500);
    }
}

reconcile.get("/assets/reconcile-deletions", handleReconciliation);
reconcile.post("/assets/reconcile-deletions", handleReconciliation);

export default reconcile;