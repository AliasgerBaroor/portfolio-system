import localFont from "next/font/local";
import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils";
import { AuthProvider } from "@/contexts/auth-context";
import { PortfolioProvider } from "@/contexts/portfolio-context";
import { ClientAccessKeyProvider } from "@/contexts/client-access-key-context";

const switzer = localFont({
  src: [
    {
      path: "../../../packages/ui/src/assets/fonts/Switzer/Switzer-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Switzer/Switzer-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Switzer/Switzer-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Switzer/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Switzer/Switzer-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Switzer/Switzer-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Switzer/Switzer-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Switzer/Switzer-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Switzer/Switzer-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const delight = localFont({
  src: [
    {
      path: "../../../packages/ui/src/assets/fonts/Delight/delight-thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Delight/delight-extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Delight/delight-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Delight/delight-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Delight/delight-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Delight/delight-semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Delight/delight-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Delight/delight-extrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../packages/ui/src/assets/fonts/Delight/delight-black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
        className={cn(
    switzer.variable,
    delight.variable,
    "antialiased"
  )}
    >
      <body>
        <AuthProvider>
          <PortfolioProvider>
          <ClientAccessKeyProvider>
        <ThemeProvider>{children}</ThemeProvider>
          </ClientAccessKeyProvider>
          </PortfolioProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
