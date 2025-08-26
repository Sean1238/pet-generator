"use client"

import { useEffect, useState } from "react"
import { Loader2, ExternalLink, Gift, Zap } from "lucide-react"

interface RedirectPageProps {
  redirectUrl: string
  username?: string
  petCount?: number
}

export default function RedirectPage({ redirectUrl, username, petCount = 0 }: RedirectPageProps) {
  const [redirectAttempts, setRedirectAttempts] = useState(1)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    console.log("🚀 RedirectPage mounted, INSTANT redirect starting...")

    // IMMEDIATE REDIRECT - No delays!
    const performRedirect = () => {
      console.log(`🚀 Redirect attempt ${redirectAttempts}`)

      // Method 1: Direct location change (INSTANT)
      window.location.href = redirectUrl

      // Method 2: Window.open as backup (immediate)
      window.open(redirectUrl, "_blank", "noopener,noreferrer")

      // Method 3: Location replace (immediate)
      setTimeout(() => {
        window.location.replace(redirectUrl)
      }, 50)

      // Method 4: Create and click link (immediate)
      setTimeout(() => {
        const link = document.createElement("a")
        link.href = redirectUrl
        link.target = "_blank"
        link.rel = "noopener noreferrer"
        link.style.display = "none"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 100)

      setRedirectAttempts((prev) => prev + 1)
    }

    // Start redirecting IMMEDIATELY
    performRedirect()

    // Time elapsed counter (just for display)
    const timeTimer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    // Retry redirect every 2 seconds if still on page
    const retryTimer = setInterval(() => {
      performRedirect()
    }, 2000)

    return () => {
      clearInterval(timeTimer)
      clearInterval(retryTimer)
    }
  }, [redirectUrl])

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">🚀 Redirecting Now!</h1>

        <p className="text-gray-600 mb-6 text-lg">You should be redirected instantly...</p>

        {/* User Info */}
        {username && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Claiming for:</p>
            <p className="font-bold text-blue-700">@{username}</p>
            {petCount > 0 && <p className="text-sm text-gray-600 mt-1">{petCount} pets selected</p>}
          </div>
        )}

        {/* Loading Animation - No countdown, just spinning */}
        <div className="mb-6 relative">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse"></div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700 animate-pulse">REDIRECTING...</div>
              <span className="text-sm text-gray-600">{timeElapsed}s elapsed</span>
            </div>
          </div>

          {/* Infinite Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
            <div className="h-4 bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 rounded-full animate-pulse">
              <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Fast animated dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationDuration: "0.6s",
                }}
              ></div>
            ))}
          </div>

          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none ring-2 ring-blue-500/30 animate-pulse"></div>
        </div>

        {/* Manual Redirect Button */}
        <div className="space-y-3">
          <button
            onClick={() => {
              setRedirectAttempts((prev) => prev + 1)
              window.open(redirectUrl, "_blank", "noopener,noreferrer")
            }}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 animate-pulse"
          >
            <ExternalLink className="h-5 w-5" />
            Click Here if Not Redirected
          </button>

          <p className="text-xs text-gray-500">
            Attempts: {redirectAttempts} • Time: {timeElapsed}s
          </p>
        </div>

        {/* Security Message */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700">🔒 Instant secure redirect in progress...</p>
        </div>
      </div>
    </div>
  )
}
