"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Field } from "@workspace/ui/components/field";
import { Frame } from "@workspace/ui/components/frame";
import { Input } from "@workspace/ui/components/input";
import { Typography } from "@workspace/ui/components/typography";
import { LockIcon } from "@workspace/ui/icons/lock";

import { useClientAccess } from "@/contexts/client-access-context";

export default function ClientLogin() {
  const { login } = useClientAccess();

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!password.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(password);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Invalid password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/auth/login-bg.webp')",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <Card className="w-full p-10">
            <div className="flex flex-col gap-6">

              <div className="flex justify-center">
                <Frame
                  strength="high"
                  shift={2}
                  className="bg-primary p-7"
                >
                  <LockIcon />
                </Frame>
              </div>

              <Typography
                variant="heading-lg"
                className="text-center"
              >
                Please enter password to
                <br />
                view My Portfolio
              </Typography>

              <form onSubmit={handleSubmit}>
                <Field>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    disabled={loading}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    endContent={
                      <Button
                        type="submit"
                        size="sm"
                        horizontalPadding={28}
                        disabled={
                          loading ||
                          !password.trim()
                        }
                      >
                        {loading
                          ? "Loading..."
                          : "Let's go"}
                      </Button>
                    }
                  />
                </Field>

                {error && (
                  <Typography
                    variant="caption"
                    className="mt-2 text-destructive"
                  >
                    {error}
                  </Typography>
                )}
              </form>

            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}