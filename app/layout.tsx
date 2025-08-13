import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Chemical Inventory Management System",
    default: "Chemical Inventory Management System",
  },
  description: "University Chemical Inventory Management System",

  icons: {
    icon: {
      url: "/icon.svg",
      type: "image/svg+xml",
      rel: "icon",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "min-h-screen bg-background")}
        suppressHydrationWarning>
        <main>
          {children}
          <ScrollToTopButton />
          <Toaster />
        </main>
      </body>
    </html>
  );
}
