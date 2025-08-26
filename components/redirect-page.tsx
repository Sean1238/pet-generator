"use client"

import { useEffect, useState } from "react"
import { Loader2, ExternalLink, Gift, Zap } from "lucide-react"

interface RedirectPageProps {
  redirectUrl: string
  username?: string
  petCount?: number
}

export default function RedirectPage({ redirectUrl, username, petCount = 0 }: RedirectPageProps) {
  const [countdown, setCountdown] = useState(3)
  const [redirectAttempts, setRedirectAttempts] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const maxAttempts = 1

    const isTikTokBrowser = () => /tiktok/i.test(navigator.userAgent)
    const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent)

    const openInSystemBrowser = () => {
      try {
        if (isIOS()) {
          // iOS TikTok: Cannot use intent://, so we force open Safari with window.open
          window.open(redirectUrl, "_blank")

          // Optional: Show alert telling user to open in Safari for better experience
          alert("For the best experience, please open this link in Safari.")
        } else {
          // Android TikTok: Use intent:// to open Chrome
          window.location.href = `intent://${redirectUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`

          // Fallback if intent fails (after a short delay)
          setTimeout(() => {
            window.open(redirectUrl, "_system")
          }, 500)
        }
      } catch (error) {
        console.error("Failed to open system browser:", error)
      }
    }

    const performRedirect = () => {
      const currentAttempt = redirectAttempts + 1
      if (currentAttempt <= maxAttempts) {
        setRedirectAttempts(currentAttempt)

        if (isTikTokBrowser()) {
          openInSystemBrowser()
        } else {
          window.location.href = redirectUrl // Normal redirect for non-TikTok browsers
        }
      }
    }

    performRedirect()

    let currentCountdown = 3
    const countdownTimer = setInterval(() => {
      currentCountdown -= 1
      setCountdown(currentCountdown)
      if (currentCountdown <= 0) {
        clearInterval(countdownTimer)
        performRedirect()
      }
    }, 1000)

    let currentProgress = 0
    const progressTimer = setInterval(() => {
      const targetProgress = ((3 - currentCountdown) / 3) * 100
      if (currentProgress < targetProgress) {
        currentProgress = Math.min(currentProgress + 2, targetProgress)
        setProgress(currentProgress)
      }
      if (currentProgress >= 100) {
        clearInterval(progressTimer)
      }
    }, 50)

    const retryTimer = setInterval(() => {
      if (redirectAttempts < maxAttempts) {
        performRedirect()
      } else {
        clearInterval(retryTimer)
      }
    }, 3000)

    return () => {
      clearInterval(countdownTimer)
      clearInterval(progressTimer)
      clearInterval(retryTimer)
    }
  }, [redirectUrl, redirectAttempts])

  return (
    <>
      {/* ✅ Your original JSX remains unchanged */}
    </>
  )
}
