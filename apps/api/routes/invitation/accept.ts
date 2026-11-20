import { Hono } from "hono";

import { authMiddleware } from "../../middleware/auth.middleware";
import {
    acceptWorkspaceInvitation,
    InvitationAcceptanceError,
} from "../../services/workspace/accept-workspace-invitation.service";

const accept = new Hono();

accept.post("/:token/accept", authMiddleware, async (c) => {
    try {
        const user = c.get("user");
        const token = c.req.param("token");

        if (!token) {
            return c.json(
                { success: false, message: "Invitation token is required." },
                400,
            );
        }

        if (!user.email) {
            return c.json(
                { success: false, message: "Your account does not have an email address." },
                400,
            );
        }

        const membership = await acceptWorkspaceInvitation(
            user.id,
            user.email,
            token,
        );

        return c.json({
            success: true,
            message: "You have joined the workspace successfully.",
            membership,
        });
    } catch (error) {
        if (error instanceof InvitationAcceptanceError) {
            return c.json(
                { success: false, message: error.message },
                error.statusCode,
            );
        }

        console.error("Accept workspace invitation error:", error);

        return c.json(
            { success: false, message: "Failed to accept workspace invitation." },
            500,
        );
    }
});

export default accept;