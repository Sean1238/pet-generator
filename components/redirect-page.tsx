"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink } from "lucide-react"
import { createPortal } from "react-dom"

interface RedirectPageProps {
  redirectUrl: string
  username?: string
  petCount?: number
}

export default function RedirectPage({ redirectUrl, username, petCount = 0 }: RedirectPageProps) {
  const [countdown, setCountdown] = useState(3)
  const [redirectAttempts, setRedirectAttempts] = useState(0)
  const [progress, setProgress] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)
  const [browserType, setBrowserType] = useState("default")
  const [showPopup, setShowPopup] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Detect In-App Browser
  const getBrowserName = () => {
    const ua = navigator.userAgent
    if (/tiktok/i.test(ua)) return "TikTok"
    if (/FBAN|FBAV/i.test(ua)) return "Facebook"
    if (/Instagram/i.test(ua)) return "Instagram"
    if (/Chrome/i.test(ua)) return "Chrome"
    if (/Safari/i.test(ua)) return "Safari"
    return "Other"
  }

  const isTikTokBrowser = () => /tiktok/i.test(navigator.userAgent)
  const isInAppBrowser = () => /FBAN|FBAV|Instagram|Line|WhatsApp|WeChat|Snapchat|tiktok/i.test(navigator.userAgent)
  const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent)

  const forceOpenExternalBrowser = () => {
    try {
      if (isIOS()) {
        // iOS Safari deep link
        const newTab = window.open(redirectUrl, "_blank")
        setTimeout(() => {
          if (newTab) {
            newTab.focus()
            window.close()
          }
        }, 500)
      } else {
        // Android Chrome Intent
        window.location.href = `intent://${redirectUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`
        setTimeout(() => {
          window.open(redirectUrl, "_system")
          window.close()
        }, 800)
      }
    } catch (error) {
      console.error("Failed to force open external browser:", error)
    }
  }

  const performRedirect = () => {
    const currentAttempt = redirectAttempts + 1
    setRedirectAttempts(currentAttempt)

    if (isTikTokBrowser() || isInAppBrowser()) {
      forceOpenExternalBrowser()
    } else {
      window.location.href = redirectUrl
    }
  }

  useEffect(() => {
    const maxAttempts = 1
    setBrowserType(getBrowserName())
    performRedirect()

    // Countdown
    let currentCountdown = 3
    const countdownTimer = setInterval(() => {
      currentCountdown -= 1
      setCountdown(currentCountdown)
      if (currentCountdown <= 0) {
        clearInterval(countdownTimer)
        if (redirectAttempts < maxAttempts) {
          performRedirect()
        }
      }
    }, 1000)

    // Progress bar
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

    // Auto-click fallback after 2.5s
    const autoClickTimer = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.click()
      }
    }, 2500)

    // Last-resort popup after 5s
    const popupTimer = setTimeout(() => {
      setShowPopup(true)
    }, 5000)

    // Track time elapsed
    const timeTracker = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(countdownTimer)
      clearInterval(progressTimer)
      clearInterval(timeTracker)
      clearTimeout(autoClickTimer)
      clearTimeout(popupTimer)
    }
  }, [redirectUrl])

  return (
    <>
      {/* Original JSX - UNCHANGED */}
      <div className="p-6 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-lg font-semibold">
            Redirecting you to your claim site...
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            ref={buttonRef}
            className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
              showInstructions
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white animate-bounce"
                : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white animate-pulse"
            }`}
            onClick={() => (window.location.href = redirectUrl)}
          >
            <ExternalLink className="h-5 w-5" />
            {showInstructions ? "🚀 OPEN CLAIM SITE NOW!" : "Click Here if Not Redirected"}
          </button>

          <p className="text-xs text-gray-500">
            Attempts: {redirectAttempts} • Time: {timeElapsed}s • Browser: {getBrowserName()}
          </p>
        </div>

        {/* Security Message */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700">
            🔒 {browserType === "messenger" ? "Messenger-optimized" : "Instant"} secure redirect in progress...
          </p>
        </div>
      </div>

      {/* Popup for Last Resort */}
      {showPopup &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm text-center shadow-xl">
              <h2 className="text-xl font-bold mb-4">Having Trouble?</h2>
              <p className="text-gray-700 mb-4">
                It looks like your browser is blocking redirects.  
                Please tap the button below to open in your default browser for best experience.
              </p>
              <button
                onClick={forceOpenExternalBrowser}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
              >
                Open in Browser
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
