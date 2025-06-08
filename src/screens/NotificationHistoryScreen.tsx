import type React from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNotification, type NotificationData } from "../context/NotificationContext"

const NotificationHistoryScreen: React.FC = () => {
  const { notifications, clearHistory } = useNotification()

  const handleClearHistory = () => {
    Alert.alert("Clear History", "Are you sure you want to clear all notification history?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearHistory },
    ])
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const renderNotificationItem = ({ item }: { item: NotificationData }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationIcon}>
        <Ionicons name="bag" size={24} color="#95BF47" />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{formatDate(item.timestamp)}</Text>
        </View>
        <Text style={styles.notificationBody} numberOfLines={3}>
          {item.body}
        </Text>
        <View style={styles.notificationFooter}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>${item.orderAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.items} item{item.items > 1 ? "s" : ""}
            </Text>
          </View>
          <Text style={styles.storeName}>{item.storeName}</Text>
        </View>
      </View>
    </View>
  )

  const totalRevenue = notifications.reduce((sum, n) => sum + n.orderAmount, 0)
  const totalItems = notifications.reduce((sum, n) => sum + n.items, 0)

  return (
    <View style={styles.container}>
      {notifications.length > 0 && (
        <View style={styles.statsHeader}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Notifications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${totalRevenue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalItems}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
        </View>
      )}

      {notifications.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
          <Ionicons name="trash" size={20} color="#F44336" />
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
      )}

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Notifications Yet</Text>
          <Text style={styles.emptyText}>
            Start the notification service or send a test notification to see your order history here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  statsHeader: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-around",
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#95BF47",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    margin: 15,
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  clearButtonText: {
    color: "#F44336",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    padding: 15,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f8e8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  notificationBody: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  storeName: {
    fontSize: 12,
    color: "#95BF47",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
})

export default NotificationHistoryScreen
