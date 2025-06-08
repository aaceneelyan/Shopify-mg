"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useNotification } from "../context/NotificationContext"

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useNotification()
  const [localSettings, setLocalSettings] = useState(settings)

  const frequencyOptions = [
    { label: "1 minute", value: 1 },
    { label: "5 minutes", value: 5 },
    { label: "15 minutes", value: 15 },
    { label: "30 minutes", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "6 hours", value: 360 },
    { label: "12 hours", value: 720 },
    { label: "24 hours", value: 1440 },
  ]

  const colorOptions = [
    { name: "Shopify Green", value: "#95BF47" },
    { name: "Blue", value: "#2196F3" },
    { name: "Purple", value: "#9C27B0" },
    { name: "Orange", value: "#FF9800" },
    { name: "Red", value: "#F44336" },
    { name: "Teal", value: "#009688" },
  ]

  const handleSave = () => {
    updateSettings(localSettings)
    Alert.alert("Success", "Settings saved successfully!")
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setLocalSettings((prev) => ({ ...prev, customLogo: result.assets[0].uri }))
    }
  }

  const resetLogo = () => {
    setLocalSettings((prev) => ({ ...prev, customLogo: null }))
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Settings</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Store Name</Text>
          <TextInput
            style={styles.input}
            value={localSettings.storeName}
            onChangeText={(text) => setLocalSettings((prev) => ({ ...prev, storeName: text }))}
            placeholder="Enter your store name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notification Frequency</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
            {frequencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.optionButton, localSettings.frequency === option.value && styles.selectedOption]}
                onPress={() => setLocalSettings((prev) => ({ ...prev, frequency: option.value }))}
              >
                <Text
                  style={[styles.optionText, localSettings.frequency === option.value && styles.selectedOptionText]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Max Notifications per Period</Text>
          <TextInput
            style={styles.input}
            value={localSettings.maxNotifications.toString()}
            onChangeText={(text) =>
              setLocalSettings((prev) => ({ ...prev, maxNotifications: Number.parseInt(text) || 1 }))
            }
            placeholder="10"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Minimum Order Amount ($)</Text>
          <TextInput
            style={styles.input}
            value={localSettings.orderThreshold.toString()}
            onChangeText={(text) =>
              setLocalSettings((prev) => ({ ...prev, orderThreshold: Number.parseFloat(text) || 0 }))
            }
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Custom Logo</Text>
          <View style={styles.logoContainer}>
            <Image
              source={
                localSettings.customLogo ? { uri: localSettings.customLogo } : require("../../assets/shopify-logo.jpg")
              }
              style={styles.logoPreview}
              resizeMode="contain"
            />
            <View style={styles.logoButtons}>
              <TouchableOpacity style={styles.logoButton} onPress={pickImage}>
                <Ionicons name="camera" size={20} color="white" />
                <Text style={styles.logoButtonText}>Change</Text>
              </TouchableOpacity>
              {localSettings.customLogo && (
                <TouchableOpacity style={[styles.logoButton, styles.resetButton]} onPress={resetLogo}>
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.logoButtonText}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notification Color</Text>
          <View style={styles.colorContainer}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.value },
                  localSettings.notificationColor === color.value && styles.selectedColor,
                ]}
                onPress={() => setLocalSettings((prev) => ({ ...prev, notificationColor: color.value }))}
              >
                {localSettings.notificationColor === color.value && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Custom Notification Title</Text>
          <TextInput
            style={styles.input}
            value={localSettings.customTitle}
            onChangeText={(text) => setLocalSettings((prev) => ({ ...prev, customTitle: text }))}
            placeholder="New Order"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Custom Notification Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={localSettings.customBody}
            onChangeText={(text) => setLocalSettings((prev) => ({ ...prev, customBody: text }))}
            placeholder="Enter your custom message template"
            multiline
            numberOfLines={4}
          />
          <Text style={styles.helperText}>
            Use {"{storeName}"}, {"{items}"}, {"{amount}"} as placeholders
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save" size={24} color="white" />
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  optionsContainer: {
    flexDirection: "row",
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
  selectedOption: {
    backgroundColor: "#95BF47",
  },
  optionText: {
    fontSize: 14,
    color: "#666",
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "600",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  logoButtons: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  logoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#95BF47",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
  },
  resetButton: {
    backgroundColor: "#666",
  },
  logoButtonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "600",
  },
  colorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#333",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#95BF47",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
})

export default SettingsScreen
