export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    fullName: string;
    avatar: string | null;
    role: "ADMIN" | "USER";
}

export interface LoginResponse {
    success: boolean;
    accessToken: string;
    user: User;
}

export interface MeResponse {
    success: boolean;
    user: User;
}

export interface ApiResponse {
    success: boolean;
    message?: string;
}