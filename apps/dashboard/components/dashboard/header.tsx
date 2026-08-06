"use client";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography";
import { LogOut } from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function Header() {
  const router = useRouter();
  const { logout } = useAuth();
  
  async function handleLogout() {
    try {
      await logout();

      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <header className="flex items-start justify-between">
      <div className="space-y-1 flex flex-col gap-2">
        <Typography
          variant="overline"
          className="tracking-[0.25em] text-muted-foreground"
        >
          PORTFOLIO CONTROL
        </Typography>

        <Typography variant="heading-xl">
          My Portfolio
        </Typography>
      </div>

      <div className="flex items-center gap-4">
        {/* Draft Badge */}
        <div className="rounded-full bg-muted px-3 py-1">
          <Typography variant="caption">
            Draft
          </Typography>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="default" className="rounded-xs">
            Publish
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xs"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}