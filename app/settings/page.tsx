"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Upload, Bell, Palette, Hash } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface NotificationSettings {
  enabled: boolean
  frequency: string // '5min', '15min', '30min', '1hour', '6hour', '12hour', '24hour'
  maxPerPeriod: number
  minOrderAmount: number
  customTitle: string
  customBody: string
  storeName: string
  logoUrl: string
  notificationColor: string
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  frequency: "15min",
  maxPerPeriod: 10,
  minOrderAmount: 0,
  customTitle: "New Order",
  customBody: "[{storeName}] You have a new order for {items} item{s} totaling ${amount} from Online Store.",
  storeName: "SOLUS WORLD",
  logoUrl: "",
  notificationColor: "#10b981",
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("notification-settings")
    if (saved) {
      setSettings({ ...defaultSettings, ...JSON.parse(saved) })
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem("notification-settings", JSON.stringify(settings))
    alert("Settings saved successfully!")
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setSettings((prev) => ({ ...prev, logoUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const frequencyOptions = [
    { value: "5min", label: "Every 5 minutes" },
    { value: "15min", label: "Every 15 minutes" },
    { value: "30min", label: "Every 30 minutes" },
    { value: "1hour", label: "Every hour" },
    { value: "6hour", label: "Every 6 hours" },
    { value: "12hour", label: "Every 12 hours" },
    { value: "24hour", label: "Daily" },
  ]

  const colorOptions = [
    { value: "#10b981", label: "Green", color: "bg-green-500" },
    { value: "#3b82f6", label: "Blue", color: "bg-blue-500" },
    { value: "#8b5cf6", label: "Purple", color: "bg-purple-500" },
    { value: "#f59e0b", label: "Orange", color: "bg-orange-500" },
    { value: "#ef4444", label: "Red", color: "bg-red-500" },
    { value: "#6b7280", label: "Gray", color: "bg-gray-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Notification Settings</h1>
              <p className="text-sm text-gray-500">Customize your alerts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Notifications</Label>
                <p className="text-xs text-gray-500">Receive order alerts</p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enabled: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Store Name</Label>
              <Input
                value={settings.storeName}
                onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))}
                placeholder="Enter your store name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Notification Frequency</Label>
              <Select
                value={settings.frequency}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Filtering Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Filtering & Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Max Notifications per Period: {settings.maxPerPeriod}</Label>
              <Slider
                value={[settings.maxPerPeriod]}
                onValueChange={([value]) => setSettings((prev) => ({ ...prev, maxPerPeriod: value }))}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Limit notifications to prevent spam</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Minimum Order Amount ($)</Label>
              <Input
                type="number"
                value={settings.minOrderAmount}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, minOrderAmount: Number.parseFloat(e.target.value) || 0 }))
                }
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500">Only notify for orders above this amount</p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Custom Logo</Label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <Image
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <Upload className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <Input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Notification Color</Label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSettings((prev) => ({ ...prev, notificationColor: color.value }))}
                    className={`p-3 rounded-lg border-2 flex items-center gap-2 text-sm ${
                      settings.notificationColor === color.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${color.color}`} />
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Custom Title</Label>
              <Input
                value={settings.customTitle}
                onChange={(e) => setSettings((prev) => ({ ...prev, customTitle: e.target.value }))}
                placeholder="New Order"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Custom Message Template</Label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
                rows={3}
                value={settings.customBody}
                onChange={(e) => setSettings((prev) => ({ ...prev, customBody: e.target.value }))}
                placeholder="Enter your custom message template"
              />
              <p className="text-xs text-gray-500">
                Use {"{storeName}"}, {"{items}"}, {"{amount}"} as placeholders
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={saveSettings} className="w-full bg-green-600 hover:bg-green-700">
          Save Settings
        </Button>
      </div>
    </div>
  )
}
