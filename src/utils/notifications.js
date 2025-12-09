import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function initNotifications() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    if (req.status !== "granted") {
      console.log("Notification permission not granted");
      return;
    }
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function scheduleItemReminder(name, minutesFromNow) {
  if (!minutesFromNow) return;
  const triggerDate = new Date(Date.now() + minutesFromNow * 60 * 1000);

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Grocery reminder",
      body: `Don't forget to buy ${name}!`,
    },
    trigger: triggerDate,
  });
}

export async function scheduleWeeklyReminder() {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Weekly grocery reminder",
      body: "Time to review your grocery list!",
    },
    trigger: {
      repeats: true,
      weekday: 7, // Sunday
      hour: 10,
      minute: 0,
    },
  });
}
