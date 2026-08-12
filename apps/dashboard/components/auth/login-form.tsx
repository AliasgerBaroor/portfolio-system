"use client";
import { Frame } from "@workspace/ui/components/frame";
import { Typography } from "@workspace/ui/components/typography";
import { LockIcon } from "@workspace/ui/icons/lock";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

import { Button } from "@workspace/ui/components/button";

import {
    Card,
} from "@workspace/ui/components/card";

import {
    Field,
    FieldGroup,
} from "@workspace/ui/components/field";

import { Input } from "@workspace/ui/components/input";

import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();

    const {
        login,
        loginLoading,
    } = useAuth();

    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError("");

        try {
            await login(email, password);

            router.push("/");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    return (
        <main className={cn("relative min-h-screen overflow-hidden", className)}  {...props}>
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/auth/login-bg.webp')",
                }}
            />

            {/* Login content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <div className="w-full max-w-xl">
                    <Card className="w-full p-10">
                        <div className="flex flex-col gap-6">
                            {/* Lock */}
                            <div className="flex justify-center">
                                <Frame strength="high" shift={2} className="p-7 bg-primary">
                                    <LockIcon />
                                </Frame>
                            </div>

                            {/* Heading */}
                            <Typography
                                variant="heading-lg"
                                className="text-center"
                            >
                                Please enter credentials to
                                <br />
                                acess dashboard
                            </Typography>

                            {/* Password */}
                            <form onSubmit={handleLogin}>
                                <FieldGroup className="space-y-3">
                                <Field>
                                    <Input
                                            type="email"
                                            placeholder="a@logifex.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loginLoading}
                                    />
                                </Field>
                                <Field>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loginLoading}
                                        placeholder="Enter password"
                                    />
                                </Field>
                                    {
                                        error && (
                                            <p className="text-sm text-destructive">
                                                {error}
                                            </p>
                                        )
                                    }

                                    <Field>
                                        <div className="flex gap-2">
                                            <Button
                                                className="flex-1 h-10"
                                                type="submit"
                                                disabled={loginLoading}
                                            >
                                                {loginLoading
                                                    ? "Logging in..."
                                                    : "Login"}
                                            </Button>
                                            <Button
                                                className="flex-1 h-10"
                                                type="submit"
                                                variant="secondary"
                                                disabled={true}
                                                onProgress={(e) => {return}}
                                            >
                                                {loginLoading
                                                    ? "Logging in..."
                                                    : "Login with google"}
                                            </Button>

                                        </div>
                                    </Field>

                                </FieldGroup>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}