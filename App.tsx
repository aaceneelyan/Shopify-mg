import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { NotificationProvider } from "./src/context/NotificationContext"
import HomeScreen from "./src/screens/HomeScreen"
import SettingsScreen from "./src/screens/SettingsScreen"
import NotificationHistoryScreen from "./src/screens/NotificationHistoryScreen"

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NotificationProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline"
              } else if (route.name === "Settings") {
                iconName = focused ? "settings" : "settings-outline"
              } else if (route.name === "History") {
                iconName = focused ? "list" : "list-outline"
              } else {
                iconName = "home-outline"
              }

              return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: "#95BF47",
            tabBarInactiveTintColor: "gray",
            headerStyle: {
              backgroundColor: "#95BF47",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Shopify Notifications" }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
          <Tab.Screen
            name="History"
            component={NotificationHistoryScreen}
            options={{ title: "Notification History" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </NotificationProvider>
  )
}
