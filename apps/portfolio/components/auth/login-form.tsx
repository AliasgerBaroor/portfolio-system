"use client";

import { cn } from "@workspace/ui/lib/utils";

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
import Link from "next/link";

import { useRouter } from "next/navigation";
export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="pb-6">

                    <CardTitle className="font-heading">
                        Login to your account
                    </CardTitle>
                    <CardDescription className="font-sans">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 px-8 pb-4" >
                    <form>
                        <FieldGroup className="space-y-3">
                            <Field>
                                <FieldLabel className="font-medium text-muted-foreground">Email</FieldLabel>
                                <Input
                                    type="email"
                                    placeholder="m@example.com"
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel className="font-medium text-muted-foreground">Password</FieldLabel>

                                    <Link
                                        href="/forgot-password"
                                        className="ml-auto text-sm hover:underline font-sans"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                <Input type="password" />
                            </Field>

                            <Field>
                                <div className="flex gap-2">
                                    <Button className="flex-1 h-10" type="button"
                                        onClick={() => router.push("/")}>
                                        Login
                                    </Button>

                                    <Button
                                        className="flex-1 h-10"
                                        variant="outline"
                                        type="button"
                                    >
                                        Login with Google
                                    </Button>
                                </div>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}