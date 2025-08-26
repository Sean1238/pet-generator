"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface RedirectPageProps {
  redirectUrl: string;
}

export default function RedirectPage({ redirectUrl }: RedirectPageProps) {
  const [browserType, setBrowserType] = useState<
    "messenger" | "tiktok" | "instagram" | "other"
  >("other");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const userAgent =
      typeof window !== "undefined" ? window.navigator.userAgent.toLowerCase() : "";
    let detectedBrowser: "messenger" | "tiktok" | "instagram" | "other" = "other";

    if (
      userAgent.includes("fban") ||
      userAgent.includes("fbav") ||
      userAgent.includes("messenger")
    ) {
      detectedBrowser = "messenger";
    } else if (
      userAgent.includes("tiktok") ||
      userAgent.includes("musically") ||
      userAgent.includes("bytedance")
    ) {
      detectedBrowser = "tiktok";
    } else if (userAgent.includes("instagram")) {
      detectedBrowser = "instagram";
    }

    setBrowserType(detectedBrowser);

    let attempts = 1; // ✅ Track attempts
    const maxAttempts = 1; // ✅ Limit retries

    const performRedirect = () => {
      console.log(`Redirect attempt ${attempts}`);

      if (detectedBrowser === "messenger") {
        try {
          window.location.href = redirectUrl;
        } catch (error) {
          console.error("Redirect error:", error);
        }

        setTimeout(() => {
          const link = document.createElement("a");
          link.href = redirectUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 100);

        setTimeout(() => {
          window.location.replace(redirectUrl);
        }, 500);

        setTimeout(() => {
          setShowInstructions(true);
        }, 2000);

        setTimeout(() => {
          const link = document.createElement("a");
          link.href = redirectUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 3000);
      } else {
        try {
          window.location.href = redirectUrl;
        } catch (error) {
          console.error("Redirect error:", error);
        }

        setTimeout(() => {
          window.open(redirectUrl, "_blank", "noopener,noreferrer");
        }, 150);
      }

      attempts++;
      setRedirectAttempts(attempts);
    };

    performRedirect();

    const retryInterval = detectedBrowser === "messenger" ? 2000 : 2500;
    const retryTimer = setInterval(() => {
      if (attempts <= maxAttempts && !showInstructions) {
        performRedirect();
      } else {
        clearInterval(retryTimer);
        if (attempts > maxAttempts) {
          setShowInstructions(true); // ✅ Show manual instructions after last attempt
        }
      }
    }, retryInterval);

    const timeTimer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(retryTimer);
      clearInterval(timeTimer);
    };
  }, [redirectUrl, showInstructions]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-lg shadow-xl border border-indigo-100">
        <CardContent className="p-6 text-center">
          <AnimatePresence mode="wait">
            {!showInstructions ? (
              <motion.div
                key="redirecting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-2xl font-bold mb-4 text-indigo-700">
                  Redirecting you to the app...
                </h1>
                <p className="text-gray-600 mb-2">Please wait a moment.</p>
                <div className="mt-4 text-sm text-gray-500">
                  Time Elapsed: {timeElapsed}s | Attempts: {redirectAttempts}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="instructions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-indigo-700">
                  Please open the link manually
                </h2>
                <p className="text-gray-600 mb-2">
                  It seems your browser is blocking the redirect. Please click the link below:
                </p>
                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline font-medium break-all"
                >
                  {redirectUrl}
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
