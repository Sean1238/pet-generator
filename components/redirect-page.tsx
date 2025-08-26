"use client"

import { useEffect, useState } from "react"
import { Loader2, ExternalLink, Gift, Zap, Smartphone, Globe } from "lucide-react"

interface RedirectPageProps {
redirectUrl: string
username?: string
petCount?: number
}

export default function RedirectPage({ redirectUrl, username, petCount = 0 }: RedirectPageProps) {
const [redirectAttempts, setRedirectAttempts] = useState(1)
const [timeElapsed, setTimeElapsed] = useState(0)
const [browserType, setBrowserType] = useState<"messenger" | "tiktok" | "instagram" | "other">("other")
const [showInstructions, setShowInstructions] = useState(false)

useEffect(() => {
// Enhanced browser detection
const userAgent = typeof window !== "undefined" ? window.navigator.userAgent.toLowerCase() : ""

let detectedBrowser: "messenger" | "tiktok" | "instagram" | "other" = "other"  

if (userAgent.includes("fban") || userAgent.includes("fbav") || userAgent.includes("messenger")) {  
  detectedBrowser = "messenger"  
} else if (userAgent.includes("tiktok") || userAgent.includes("musically") || userAgent.includes("bytedance")) {  
  detectedBrowser = "tiktok"  
} else if (userAgent.includes("instagram")) {  
  detectedBrowser = "instagram"  
}  

setBrowserType(detectedBrowser)  
console.log(`🔍 Detected browser: ${detectedBrowser}`)  
console.log(`🔍 User Agent: ${userAgent}`)  

const performRedirect = () => {  
  console.log(`🚀 Redirect attempt ${redirectAttempts} for ${detectedBrowser}`)  

  if (detectedBrowser === "messenger") {  
    // Messenger-specific redirect strategy  
    console.log("📱 Using Messenger-optimized redirect...")  

    // Method 1: Try direct navigation first  
    try {  
      window.location.href = redirectUrl  
    } catch (e) {  
      console.log("❌ Direct navigation blocked")  
    }  

    // Method 2: Create a visible link and auto-click it  
    setTimeout(() => {  
      const link = document.createElement("a")  
      link.href = redirectUrl  
      link.target = "_blank"  
      link.rel = "noopener noreferrer"  
      link.style.position = "fixed"  
      link.style.top = "-1000px"  
      link.style.left = "-1000px"  
      document.body.appendChild(link)  

      // Simulate user click  
      const clickEvent = new MouseEvent("click", {  
        bubbles: true,  
        cancelable: true,  
        view: window,  
      })  
      link.dispatchEvent(clickEvent)  

      setTimeout(() => {  
        document.body.removeChild(link)  
      }, 1000)  
    }, 100)  

    // Method 3: Show manual instructions after 2 seconds  
    setTimeout(() => {  
      setShowInstructions(true)  
    }, 2000)  
  } else {  
    // Standard redirect for other browsers  
    console.log("🌐 Using standard redirect methods...")  

    // Method 1: Direct location change  
    window.location.href = redirectUrl  

    // Method 2: Window.open as backup  
    setTimeout(() => {  
      window.open(redirectUrl, "_blank", "noopener,noreferrer")  
    }, 50)  

    // Method 3: Location replace  
    setTimeout(() => {  
      window.location.replace(redirectUrl)  
    }, 100)  

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
    }, 150)  
  }  

  setRedirectAttempts((prev) => prev + 1)  
}  

// Start redirecting IMMEDIATELY  
performRedirect()  

// Time elapsed counter  
const timeTimer = setInterval(() => {  
  setTimeElapsed((prev) => prev + 1)  
}, 1000)  

// Retry redirect - more frequent for Messenger  
const retryInterval = detectedBrowser === "messenger" ? 1500 : 2000  
const retryTimer = setInterval(() => {  
  if (!showInstructions) {  
    performRedirect()  
  }  
}, retryInterval)  

return () => {  
  clearInterval(timeTimer)  
  clearInterval(retryTimer)  
}

}, [redirectUrl])

const getBrowserIcon = () => {
switch (browserType) {
case "messenger":
return <Smartphone className="h-5 w-5 text-blue-600" />
case "tiktok":
return <Smartphone className="h-5 w-5 text-pink-600" />
case "instagram":
return <Smartphone className="h-5 w-5 text-purple-600" />
default:
return <Globe className="h-5 w-5 text-gray-600" />
}
}

const getBrowserName = () => {
switch (browserType) {
case "messenger":
return "Facebook Messenger"
case "tiktok":
return "TikTok"
case "instagram":
return "Instagram"
default:
return "Browser"
}
}

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

    {/* Browser Detection */}  
    <div className="flex justify-center items-center gap-2 mb-4">  
      {getBrowserIcon()}  
      <span className="text-sm text-gray-600">Detected: {getBrowserName()}</span>  
    </div>  

    {/* Main Message */}  
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">  
      {showInstructions ? "📱 Manual Redirect Needed" : "🚀 Redirecting Now!"}  
    </h1>  

    <p className="text-gray-600 mb-6 text-lg">  
      {showInstructions  
        ? `${getBrowserName()} blocked auto-redirect. Please click the button below.`  
        : "You should be redirected instantly..."}  
    </p>  

    {/* User Info */}  
    {username && (  
      <div className="bg-blue-50 rounded-lg p-4 mb-6">  
        <p className="text-sm text-gray-600 mb-1">Claiming for:</p>  
        <p className="font-bold text-blue-700">@{username}</p>  
        {petCount > 0 && <p className="text-sm text-gray-600 mt-1">{petCount} pets selected</p>}  
      </div>  
    )}  

    {/* Loading Animation or Instructions */}  
    {!showInstructions ? (  
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
      </div>  
    ) : (  
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">  
        <h3 className="font-bold text-yellow-800 mb-2">📱 {getBrowserName()} Instructions:</h3>  
        <ol className="text-sm text-yellow-700 text-left space-y-1">  
          <li>1. Tap the button below</li>  
          <li>2. Choose "Open in Browser" or "Open in Safari"</li>  
          <li>3. Your pets will be waiting!</li>  
        </ol>  
      </div>  
    )}  

    {/* Manual Redirect Button */}  
    <div className="space-y-3">  
      <button  
        onClick={() => {  
          setRedirectAttempts((prev) => prev + 1)  

          // For Messenger, try multiple methods  
          if (browserType === "messenger") {  
            // Method 1: Direct window.open  
            window.open(redirectUrl, "_blank", "noopener,noreferrer")  

            // Method 2: Create link and click  
            setTimeout(() => {  
              const link = document.createElement("a")  
              link.href = redirectUrl  
              link.target = "_blank"  
              link.rel = "noopener noreferrer"  
              link.click()  
            }, 100)  

            // Method 3: Try location change  
            setTimeout(() => {  
              window.location.href = redirectUrl  
            }, 200)  
          } else {  
            window.open(redirectUrl, "_blank", "noopener,noreferrer")  
          }  
        }}  
        className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${  
          showInstructions  
            ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white animate-bounce"  
            : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white animate-pulse"  
        }`}  
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
</div>

)
}

