import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Field } from "@workspace/ui/components/field";
import { Frame } from "@workspace/ui/components/frame";
import { Input } from "@workspace/ui/components/input";
import { Typography } from "@workspace/ui/components/typography";
import { LockIcon } from "@workspace/ui/icons/lock";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/auth/login-bg.webp')",
        }}
      />

      {/* Login content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
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
              Please enter password to
              <br />
              view My Portfolio
            </Typography>

            {/* Password */}
            <form>
              <Field>
                <Input
                  type="password"
                  placeholder="Enter password"
                  endContent={
                    <Button
                      type="button"
                      size="sm"
                      horizontalPadding={28}
                    >
                      Let's go
                    </Button>
                  }
                />
              </Field>
            </form>
          </div>
        </Card>
      </div>
      </div>
    </main>
  );
}