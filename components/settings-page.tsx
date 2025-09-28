"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Moon, Sun, Type, User, Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AccessibilitySettings {
  darkMode: boolean
  dyslexiaFont: boolean
  fontSize: number
}

interface NotificationSettings {
  deadlineReminders: boolean
  newOpportunities: boolean
}

interface ProfileSettings {
  name: string
  email: string
  location: string
  bio: string
  preferredLanguage: string
}

export function SettingsPage() {
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    darkMode: false,
    dyslexiaFont: false,
    fontSize: 16,
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    deadlineReminders: false,
    newOpportunities: false,
  })

  const [profile, setProfile] = useState<ProfileSettings>({
    name: "",
    email: "",
    location: "",
    bio: "",
    preferredLanguage: "en",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Load profile from database
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile({
          name:
            `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() || profileData.display_name || "",
          email: profileData.email || user.email || "",
          location: profileData.location || "",
          bio: profileData.bio || "",
          preferredLanguage: profileData.preferred_language || "en",
        })
      } else {
        // Set email from auth user if no profile exists
        setProfile((prev) => ({ ...prev, email: user.email || "" }))
      }
    }

    loadUserData()

    // Load accessibility and notification settings from localStorage (these are UI preferences)
    const savedAccessibility = localStorage.getItem("accessibilitySettings")
    const savedNotifications = localStorage.getItem("notificationSettings")

    if (savedAccessibility) {
      setAccessibility(JSON.parse(savedAccessibility))
    }
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [supabase, router])

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement

    if (accessibility.darkMode) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    if (accessibility.dyslexiaFont) {
      // Use a combination of dyslexia-friendly fonts with good fallbacks
      root.style.fontFamily = "Arial, Verdana, Tahoma, 'Helvetica Neue', Helvetica, sans-serif"
      // Increase letter spacing for better readability
      root.style.letterSpacing = "0.05em"
      // Increase line height for better readability
      root.style.lineHeight = "1.6"
      // Add a class to identify dyslexia mode is active
      root.classList.add("dyslexia-friendly")
    } else {
      root.style.fontFamily = ""
      root.style.letterSpacing = ""
      root.style.lineHeight = ""
      root.classList.remove("dyslexia-friendly")
    }

    root.style.fontSize = `${accessibility.fontSize}px`
  }, [accessibility])

  const updateAccessibility = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...accessibility, [key]: value }
    setAccessibility(newSettings)
    localStorage.setItem("accessibilitySettings", JSON.stringify(newSettings))
  }

  const updateNotifications = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...notifications, [key]: value }
    setNotifications(newSettings)
    localStorage.setItem("notificationSettings", JSON.stringify(newSettings))
  }

  const updateProfile = (key: keyof ProfileSettings, value: string) => {
    const newSettings = { ...profile, [key]: value }
    setProfile(newSettings)
  }

  const saveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      // Split name into first and last name
      const nameParts = profile.name.trim().split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""

      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: profile.email,
          first_name: firstName,
          last_name: lastName,
          display_name: profile.name,
          bio: profile.bio,
          location: profile.location,
          preferred_language: profile.preferredLanguage,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )

      if (error) {
        console.error("Error saving profile:", error)
        alert("Failed to save profile. Please try again.")
      } else {
        console.log("Profile saved successfully")
        if (profile.preferredLanguage !== "en") {
          // For now, just store the preference. Full i18n would require additional setup
          localStorage.setItem("preferredLanguage", profile.preferredLanguage)
          console.log(`Language preference set to: ${profile.preferredLanguage}`)
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to save profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your experience and manage your account</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile("email", e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => updateProfile("location", e.target.value)}
                placeholder="City, State or Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select
                value={profile.preferredLanguage}
                onValueChange={(value) => updateProfile("preferredLanguage", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => updateProfile("bio", e.target.value)}
              placeholder="Tell us about yourself, your goals, or anything you'd like to share..."
              className="min-h-20"
            />
          </div>

          <Button onClick={saveProfile} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Accessibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Accessibility & Display
          </CardTitle>
          <CardDescription>Customize the interface to meet your accessibility needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                {accessibility.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                Dark Mode
              </Label>
              <p className="text-sm text-muted-foreground">Reduce eye strain with a darker color scheme</p>
            </div>
            <Switch
              checked={accessibility.darkMode}
              onCheckedChange={(checked) => updateAccessibility("darkMode", checked)}
            />
          </div>

          <Separator />

          {/* Dyslexia Font */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Dyslexia-Friendly Font
              </Label>
              <p className="text-sm text-muted-foreground">
                Use dyslexia-friendly fonts with improved spacing and readability
              </p>
            </div>
            <Switch
              checked={accessibility.dyslexiaFont}
              onCheckedChange={(checked) => updateAccessibility("dyslexiaFont", checked)}
            />
          </div>

          <Separator />

          {/* Font Size */}
          <div className="space-y-3">
            <Label>Font Size: {accessibility.fontSize}px</Label>
            <Slider
              value={[accessibility.fontSize]}
              onValueChange={(value) => updateAccessibility("fontSize", value[0])}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small (12px)</span>
              <span>Large (24px)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what notifications you'd like to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Deadline Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified about upcoming application deadlines</p>
            </div>
            <Switch
              checked={notifications.deadlineReminders}
              onCheckedChange={(checked) => updateNotifications("deadlineReminders", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>New Opportunities</Label>
              <p className="text-sm text-muted-foreground">Be notified when new scholarships match your profile</p>
            </div>
            <Switch
              checked={notifications.newOpportunities}
              onCheckedChange={(checked) => updateNotifications("newOpportunities", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
