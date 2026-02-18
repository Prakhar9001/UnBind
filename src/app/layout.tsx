import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "./error-boundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unbind — Smarter Quitting, Better Reading",
  description:
    "Turn reading abandonment into strength. AI-powered coaching that helps you decide when to push through and when to quit guilt-free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
