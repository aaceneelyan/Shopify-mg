import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNotification } from "../context/NotificationContext"

const HomeScreen: React.FC = () => {
  const { settings, isRunning, startNotifications, stopNotifications, notifications, sendTestNotification } =
    useNotification()

  const handleToggleNotifications = () => {
    if (isRunning) {
      stopNotifications()
      Alert.alert("Stopped", "Notification service has been stopped.")
    } else {
      startNotifications()
      Alert.alert("Started", "Notification service has been started.")
    }
  }

  const getStatusColor = () => {
    return isRunning ? "#4CAF50" : "#F44336"
  }

  const getStatusText = () => {
    return isRunning ? "Active" : "Inactive"
  }

  const totalRevenue = notifications.reduce((sum, n) => sum + n.orderAmount, 0)
  const avgOrderValue = notifications.length > 0 ? totalRevenue / notifications.length : 0

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={settings.customLogo ? { uri: settings.customLogo } : require("../../assets/shopify-logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Shopify Notifications</Text>
        <Text style={styles.subtitle}>Stay updated with your store orders</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons name={isRunning ? "checkmark-circle" : "close-circle"} size={24} color={getStatusColor()} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
        </View>
        <Text style={styles.statusDescription}>
          {isRunning
            ? `Notifications running every ${settings.frequency} minute(s)`
            : "Notifications are currently stopped"}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: isRunning ? "#F44336" : "#4CAF50" }]}
          onPress={handleToggleNotifications}
        >
          <Ionicons name={isRunning ? "stop" : "play"} size={24} color="white" />
          <Text style={styles.toggleButtonText}>{isRunning ? "Stop Notifications" : "Start Notifications"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.testButton, { backgroundColor: "#95BF47" }]} onPress={sendTestNotification}>
          <Ionicons name="notifications" size={24} color="white" />
          <Text style={styles.toggleButtonText}>Send Test Notification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>${totalRevenue.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{notifications.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>${avgOrderValue.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Avg Order</Text>
        </View>
      </View>

      <View style={styles.recentNotifications}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        {notifications.slice(0, 5).map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <View style={styles.notificationIcon}>
              <Ionicons name="bag" size={20} color="#95BF47" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationBody} numberOfLines={2}>
                {notification.body}
              </Text>
              <View style={styles.notificationMeta}>
                <Text style={styles.notificationAmount}>${notification.orderAmount.toFixed(2)}</Text>
                <Text style={styles.notificationTime}>{notification.timestamp.toLocaleTimeString()}</Text>
              </View>
            </View>
          </View>
        ))}
        {notifications.length === 0 && (
          <Text style={styles.emptyText}>No notifications yet. Send a test notification to get started!</Text>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  statusCard: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  statusDescription: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  toggleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20,
  },
  statCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#95BF47",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  recentNotifications: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  notificationItem: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f8e8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#95BF47",
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    padding: 20,
  },
})

export default HomeScreen
