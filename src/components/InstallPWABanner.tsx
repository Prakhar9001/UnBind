"use client";

import React, { useState, useEffect, useCallback } from "react";

// TypeScript interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "unbind-pwa-install-dismissed";

export default function InstallPWABanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Don't show if already installed as standalone
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Don't show if previously dismissed (within 7 days)
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedAt < sevenDays) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
      }
    } catch {
      // Prompt failed silently
    } finally {
      setDeferredPrompt(null);
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowBanner(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  }, []);

  if (!showBanner) return null;

  return (
    <div className="install-pwa-banner" role="banner" aria-label="Install app">
      <div className="install-pwa-content">
        <div className="install-pwa-icon">📱</div>
        <div className="install-pwa-text">
          <strong>Install UnBind</strong>
          <span>Get the full app experience on your device</span>
        </div>
      </div>
      <div className="install-pwa-actions">
        <button
          className="install-pwa-btn"
          onClick={handleInstall}
          disabled={isInstalling}
          id="pwa-install-btn"
        >
          {isInstalling ? "Installing…" : "Install"}
        </button>
        <button
          className="install-pwa-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          id="pwa-dismiss-btn"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
