import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { StoreInitializer } from "@/components/StoreInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Life's Good 365 AI - Scenario Discovery Dashboard",
  description: "AI-powered content scenario discovery platform for LG Electronics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <StoreInitializer />
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
