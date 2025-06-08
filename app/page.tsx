"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, ShoppingBag, DollarSign, Clock, Hash } from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  title: string
  body: string
  amount: number
  items: number
  timestamp: Date
  storeName: string
}

export default function HomePage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false)

  useEffect(() => {
    // Load saved notifications from localStorage
    const saved = localStorage.getItem("shopify-notifications")
    if (saved) {
      const parsed = JSON.parse(saved)
      setNotifications(
        parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })),
      )
    }

    // Check notification permission
    if ("Notification" in window) {
      setIsNotificationsEnabled(Notification.permission === "granted")
    }
  }, [])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setIsNotificationsEnabled(permission === "granted")
    }
  }

  const generateMockOrder = () => {
    const amounts = [58.0, 79.84, 79.3, 158.0, 125.5, 89.99, 45.0, 199.99]
    const itemCounts = [1, 2, 3, 1, 2, 1, 1, 4]
    const storeNames = ["SOLUS WORLD", "Fashion Store", "Tech Hub", "Home Decor"]

    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)]
    const randomItems = itemCounts[Math.floor(Math.random() * itemCounts.length)]
    const randomStore = storeNames[Math.floor(Math.random() * storeNames.length)]

    return {
      id: Date.now().toString(),
      title: "New Order",
      body: `[${randomStore}] You have a new order for ${randomItems} item${randomItems > 1 ? "s" : ""} totaling $${randomAmount.toFixed(2)} from Online Store.`,
      amount: randomAmount,
      items: randomItems,
      timestamp: new Date(),
      storeName: randomStore,
    }
  }

  const sendTestNotification = () => {
    const mockOrder = generateMockOrder()

    // Add to notifications list
    const updatedNotifications = [mockOrder, ...notifications].slice(0, 50)
    setNotifications(updatedNotifications)
    localStorage.setItem("shopify-notifications", JSON.stringify(updatedNotifications))

    // Send browser notification if enabled
    if (isNotificationsEnabled) {
      new Notification(mockOrder.title, {
        body: mockOrder.body,
        icon: "/shopify-icon.png",
        badge: "/shopify-icon.png",
      })
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return "Yesterday"
    return `${days}d ago`
  }

  const totalRevenue = notifications.reduce((sum, n) => sum + n.amount, 0)
  const totalOrders = notifications.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Shopify Notifications</h1>
                <p className="text-sm text-gray-500">Order alerts & insights</p>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-semibold text-gray-900">${totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-gray-500">Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Hash className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-semibold text-gray-900">{totalOrders}</p>
              <p className="text-xs text-gray-500">Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-lg font-semibold text-gray-900">${avgOrderValue.toFixed(0)}</p>
              <p className="text-xs text-gray-500">Avg Order</p>
            </CardContent>
          </Card>
        </div>

        {/* Notification Permission */}
        {!isNotificationsEnabled && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900">Enable Notifications</p>
                  <p className="text-xs text-orange-700">Get real-time order alerts</p>
                </div>
                <Button size="sm" onClick={requestNotificationPermission}>
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Notification Button */}
        <Card>
          <CardContent className="p-4">
            <Button onClick={sendTestNotification} className="w-full bg-green-600 hover:bg-green-700">
              <Bell className="w-4 h-4 mr-2" />
              Send Test Notification
            </Button>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Orders
              {notifications.length > 0 && <Badge variant="secondary">{notifications.length}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs text-gray-400">Send a test notification to get started</p>
              </div>
            ) : (
              <div className="space-y-0">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`p-4 flex items-start gap-3 ${
                      index !== notifications.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-500">{formatTime(notification.timestamp)}</p>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{notification.body}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-xs">
                          ${notification.amount.toFixed(2)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {notification.items} item{notification.items > 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
