"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import * as Notifications from "expo-notifications"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface NotificationData {
  id: string
  title: string
  body: string
  timestamp: Date
  orderAmount: number
  items: number
  storeName: string
}

export interface NotificationSettings {
  frequency: number // in minutes
  maxNotifications: number
  orderThreshold: number
  customTitle: string
  customBody: string
  storeName: string
  customLogo: string | null
  notificationColor: string
}

interface NotificationContextType {
  settings: NotificationSettings
  notifications: NotificationData[]
  isRunning: boolean
  updateSettings: (newSettings: Partial<NotificationSettings>) => void
  startNotifications: () => void
  stopNotifications: () => void
  sendTestNotification: () => void
  clearHistory: () => void
}

const defaultSettings: NotificationSettings = {
  frequency: 15,
  maxNotifications: 10,
  orderThreshold: 0,
  customTitle: "New Order",
  customBody: "[{storeName}] You have a new order for {items} item{s} totaling ${amount} from Online Store.",
  storeName: "SOLUS WORLD",
  customLogo: null,
  notificationColor: "#95BF47",
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadSettings()
    loadNotifications()
    requestPermissions()
  }, [])

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== "granted") {
      alert("Permission to send notifications was denied!")
    }
  }

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem("notificationSettings")
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const loadNotifications = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem("notifications")
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications)
        setNotifications(
          parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          })),
        )
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem("notificationSettings", JSON.stringify(newSettings))
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  const saveNotifications = async (newNotifications: NotificationData[]) => {
    try {
      await AsyncStorage.setItem("notifications", JSON.stringify(newNotifications))
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    saveSettings(updatedSettings)
  }

  const generateMockOrder = (): NotificationData => {
    const amounts = [58.0, 79.84, 79.3, 158.0, 125.5, 89.99, 45.0, 199.99, 234.5, 67.25]
    const itemCounts = [1, 2, 3, 1, 2, 1, 1, 4, 2, 1]
    const storeNames = [settings.storeName, "Fashion Store", "Tech Hub", "Home Decor"]

    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)]
    const randomItems = itemCounts[Math.floor(Math.random() * itemCounts.length)]
    const randomStore = storeNames[Math.floor(Math.random() * storeNames.length)]

    // Skip if below threshold
    if (randomAmount < settings.orderThreshold) {
      return generateMockOrder() // Try again
    }

    const body = settings.customBody
      .replace("{storeName}", randomStore)
      .replace("{items}", randomItems.toString())
      .replace("{s}", randomItems > 1 ? "s" : "")
      .replace("{amount}", randomAmount.toFixed(2))

    return {
      id: Date.now().toString(),
      title: settings.customTitle,
      body,
      timestamp: new Date(),
      orderAmount: randomAmount,
      items: randomItems,
      storeName: randomStore,
    }
  }

  const sendNotification = async (notificationData: NotificationData) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationData.title,
        body: notificationData.body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    })

    const updatedNotifications = [notificationData, ...notifications].slice(0, 100)
    setNotifications(updatedNotifications)
    saveNotifications(updatedNotifications)
  }

  const sendTestNotification = () => {
    const mockOrder = generateMockOrder()
    sendNotification(mockOrder)
  }

  const startNotifications = () => {
    if (isRunning) return

    setIsRunning(true)
    const interval = setInterval(
      () => {
        // Check if we've hit the max notifications limit
        const recentNotifications = notifications.filter(
          (n) => Date.now() - n.timestamp.getTime() < settings.frequency * 60 * 1000,
        )

        if (recentNotifications.length < settings.maxNotifications) {
          const mockOrder = generateMockOrder()
          sendNotification(mockOrder)
        }
      },
      settings.frequency * 60 * 1000,
    ) // Convert minutes to milliseconds

    setIntervalId(interval)
  }

  const stopNotifications = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setIsRunning(false)
  }

  const clearHistory = () => {
    setNotifications([])
    AsyncStorage.removeItem("notifications")
  }

  return (
    <NotificationContext.Provider
      value={{
        settings,
        notifications,
        isRunning,
        updateSettings,
        startNotifications,
        stopNotifications,
        sendTestNotification,
        clearHistory,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
