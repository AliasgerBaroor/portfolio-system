"use client";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography/typography";
import { Separator } from "@workspace/ui/components/separator";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { usePortfolio } from "@/contexts/portfolio-context";
import { Frame } from "@workspace/ui/components/frame";
import { LogoutIcon, ChevronIcon } from "@/icons";

export default function Header() {
  const router = useRouter();
  const { logout } = useAuth();
  const {
    portfolio,
  } = usePortfolio();

  async function handleLogout() {
    try {
      await logout();

      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header>
      <Frame className="px-6 py-3" radius="sm">
        <div className="flex items-start justify-between">
          <Typography variant="heading-md">
            {portfolio?.title}
          </Typography>

          <Button
            variant="outline"
            size="icon-sm"
            radius="sm"
            className="rounded-sm"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogoutIcon />
          </Button>
        </div>
      </Frame>
    </header>
  );
}