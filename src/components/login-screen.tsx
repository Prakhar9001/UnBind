"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LoginScreen() {
  const { signIn, signUp, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
    } catch {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        {/* BRANDING */}
        <div className="login-brand">
          <div className="login-icon">📖</div>
          <h1 className="login-title">Unbind</h1>
          <p className="login-subtitle">Smarter Quitting, Better Reading</p>
        </div>

        {/* FORM */}
        <form className="login-form glass-card" onSubmit={handleSubmit}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: "center" }}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24, textAlign: "center" }}>
            {isSignUp ? "Start your reading journey" : "Sign in to your library"}
          </p>

          {/* ERROR */}
          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              placeholder={isSignUp ? "Min 6 characters" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !email.trim() || !password.trim()}
            style={{ marginTop: 8, padding: "14px 24px", fontSize: 16 }}
          >
            {loading ? "⏳ Please wait..." : isSignUp ? "🚀 Create Account" : "📖 Sign In"}
          </button>

          <div className="login-toggle">
            <span style={{ color: "var(--text-muted)" }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              type="button"
              className="login-toggle-btn"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>

        {/* PHILOSOPHY */}
        <div className="login-footer">
          <p>
            <strong>Smarter quitting &gt; forced finishing.</strong>
            <br />
            AI-powered coaching that helps you decide when to push through and when to quit guilt-free.
          </p>
        </div>
      </div>
    </div>
  );
}
