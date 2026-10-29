
import { setCookie, deleteCookie } from "hono/cookie";
import type { Context } from "hono";

const COOKIE_NAME = "refresh_token";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
};

export function setRefreshCookie(
    c: Context,
    token: string
) {
    setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS);
}

export function clearRefreshCookie(
    c: Context
) {
    deleteCookie(c, COOKIE_NAME, {
        path: "/",
    });
}

export function getRefreshCookieName() {
    return COOKIE_NAME;
}