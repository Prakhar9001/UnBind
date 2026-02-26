"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LoginScreen() {
  const { signIn, signUp, resetPassword, signInWithGoogle, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setResetSent(false);
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

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      // If no email entered, we can't send a reset link
      return;
    }
    setResetLoading(true);
    setResetSent(false);
    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch {
      // Error handled by context
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setResetSent(false);
    try {
      await signInWithGoogle();
    } catch {
      // Error handled by context
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        {/* BRANDING */}
        <div className="login-brand">
          <div className="login-icon">📖</div>
          <h1 className="login-title">UnBind</h1>
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

          {/* RESET SUCCESS */}
          {resetSent && (
            <div className="login-success">
              ✅ Password reset email sent! Check your inbox.
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

          {/* FORGOT PASSWORD — only show on Sign In */}
          {!isSignUp && (
            <div className="login-forgot">
              <button
                type="button"
                className="login-forgot-btn"
                onClick={handleForgotPassword}
                disabled={resetLoading || !email.trim()}
              >
                {resetLoading ? "Sending..." : "Forgot Password?"}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !email.trim() || !password.trim()}
            style={{ marginTop: 8, padding: "14px 24px", fontSize: 16 }}
          >
            {loading ? "⏳ Please wait..." : isSignUp ? "🚀 Create Account" : "📖 Sign In"}
          </button>

          {/* DIVIDER */}
          <div className="login-divider">
            <span>or</span>
          </div>

          {/* GOOGLE SIGN-IN */}
          <button
            type="button"
            className="btn btn-social btn-full"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="login-toggle">
            <span style={{ color: "var(--text-muted)" }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              type="button"
              className="login-toggle-btn"
              onClick={() => { setIsSignUp(!isSignUp); setResetSent(false); }}
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
