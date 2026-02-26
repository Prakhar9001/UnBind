import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "./error-boundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "UnBind — AI Reading Coach",
  description:
    "Turn reading abandonment into strength. AI-powered coaching that helps you decide when to push through and when to quit guilt-free.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA: Manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* PWA: Theme color (browser chrome color on Android) */}
        <meta name="theme-color" content="#6366f1" />
        {/* PWA: iOS home screen support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="UnBind" />
        {/* PWA: Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('[UnBind] SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
