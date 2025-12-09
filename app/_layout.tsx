import { Slot } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { initNotifications } from "../src/utils/notifications";

export default function RootLayout() {
  useEffect(() => {
    initNotifications();
  }, []);

  return (
    <>
      <StatusBar />
      <Slot />
    </>
  );
}
