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

    const maxAttempts = 1 // ✅ Set to 1

    const performRedirect = () => {
      const currentAttempt = redirectAttempts + 1
      console.log(`🚀 Redirect attempt ${currentAttempt}`)

      if (currentAttempt <= maxAttempts) { // ✅ Limit redirect attempts
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

    // Retry redirect every 3 seconds if still on page
    const retryTimer = setInterval(() => {
      if (redirectAttempts < maxAttempts) { // ✅ Stop retry after 1 attempt
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
      {/* Your original JSX here (unchanged) */}
    </>
  )
}
