import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

type IconProps = { color: string; size: number };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1f2937',
          borderTopColor: '#374151',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          color: '#d1d5db',
        },
        tabBarIcon: ({ color, size }: IconProps) => {
          let name: keyof typeof Ionicons.glyphMap = "list";

          if (route.name === "index") name = "cart-outline";
          if (route.name === "history") name = "time-outline";
          if (route.name === "settings") name = "settings-outline";

          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "List" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
