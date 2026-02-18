"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[UnBind] Render error caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-primary, #0a0f1a)",
            color: "var(--text-primary, #e2e8f0)",
            fontFamily: "system-ui, sans-serif",
            padding: 24,
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p
              style={{
                color: "var(--text-muted, #94a3b8)",
                fontSize: 14,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              UnBind hit an unexpected error. Your data is safe — try
              refreshing the page.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: "12px 32px",
                borderRadius: 12,
                border: "none",
                background: "var(--accent, #6366f1)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
