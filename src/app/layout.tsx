import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import SessionWrapper from "@/components/session/SessionWrapper"; // ✅ import wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Login Page",
  description: "Login page with React Hook Form and React Query",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <Toaster richColors position="top-right" />
            </QueryProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
