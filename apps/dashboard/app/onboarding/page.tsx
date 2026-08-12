"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { usePortfolio } from "@/contexts/portfolio-context";

import { Button } from "@workspace/ui/components/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";

import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";

import { Input } from "@workspace/ui/components/input";

export default function OnboardingPage() {
    const router = useRouter();

    const { createPortfolio } = usePortfolio();

    const [title, setTitle] = useState("");

    const [slug, setSlug] = useState("");

    const [slugEdited, setSlugEdited] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    function generateSlug(value: string) {
        return value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
    }

    function handleTitleChange(
        value: string
    ) {
        setTitle(value);

        if (!slugEdited) {
            setSlug(generateSlug(value));
        }
    }

    function handleSlugChange(
        value: string
    ) {
        setSlugEdited(true);

        setSlug(generateSlug(value));
    }
    
    async function handleCreate(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setLoading(true);

        setError("");

        try {
            await createPortfolio({
                title,
                slug,
            });

            router.replace("/");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="pb-6">
                        <CardTitle className="font-heading">
                            Welcome 👋
                        </CardTitle>

                        <CardDescription className="font-sans">
                            Let's create your first portfolio.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0 px-8 pb-4">
                        <form
                            onSubmit={handleCreate}
                        >
                            <FieldGroup className="space-y-3">

                                <Field>
                                    <FieldLabel className="font-medium text-secondary-foreground">
                                        Portfolio Name
                                    </FieldLabel>

                                    <Input
                                        value={title}
                                        onChange={(e) =>
                                            handleTitleChange(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Aliasger Portfolio"
                                        disabled={loading}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel className="font-medium text-secondary-foreground">
                                        Portfolio URL
                                    </FieldLabel>

                                    <Input
                                        value={slug}
                                        onChange={(e) =>
                                            handleSlugChange(
                                                e.target.value
                                            )
                                        }
                                        placeholder="aliasger-portfolio"
                                        disabled={loading}
                                    />
                                </Field>

                                {error && (
                                    <p className="text-sm text-destructive">
                                        {error}
                                    </p>
                                )}

                                <Field>
                                    <Button
                                        className="w-full h-10"
                                        type="submit"
                                        disabled={
                                            loading ||
                                            !title.trim() ||
                                            !slug.trim()
                                        }
                                    >
                                        {loading
                                            ? "Creating..."
                                            : "Create Portfolio"}
                                    </Button>
                                </Field>

                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}