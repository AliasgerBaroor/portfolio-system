const SESSION_TOKEN_KEY =
    "portfolio_client_session_token";

const SESSION_EXPIRES_AT_KEY =
    "portfolio_client_session_expires_at";

const DEVICE_ID_KEY =
    "portfolio_client_device_id";

export function getClientSessionToken() {
    if (
        typeof window ===
        "undefined"
    ) {
        return null;
    }

    return localStorage.getItem(
        SESSION_TOKEN_KEY
    );
}

export function getClientSessionExpiresAt() {
    if (
        typeof window ===
        "undefined"
    ) {
        return null;
    }

    return localStorage.getItem(
        SESSION_EXPIRES_AT_KEY
    );
}

export function setClientSession(
    token: string,
    expiresAt: string
) {
    localStorage.setItem(
        SESSION_TOKEN_KEY,
        token
    );

    localStorage.setItem(
        SESSION_EXPIRES_AT_KEY,
        expiresAt
    );
}

export function clearClientSession() {
    if (
        typeof window ===
        "undefined"
    ) {
        return;
    }

    localStorage.removeItem(
        SESSION_TOKEN_KEY
    );

    localStorage.removeItem(
        SESSION_EXPIRES_AT_KEY
    );
}

export function getClientDeviceId() {
    if (
        typeof window ===
        "undefined"
    ) {
        return "";
    }

    let deviceId =
        localStorage.getItem(
            DEVICE_ID_KEY
        );

    if (!deviceId) {
        deviceId =
            crypto.randomUUID();

        localStorage.setItem(
            DEVICE_ID_KEY,
            deviceId
        );
    }

    return deviceId;
}