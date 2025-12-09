import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Colors } from "../../constants/theme";
import { useGroceryStore } from "../../src/store/useGroceryStore";
import { scheduleWeeklyReminder } from "../../src/utils/notifications";

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const theme = useGroceryStore((s) => s.theme);
  const setTheme = useGroceryStore((s) => s.setTheme);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="contrast" size={20} color={colors.success} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        </View>
        <View style={styles.row}>
          {["light", "dark"].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }, theme === mode && [styles.selChip, { backgroundColor: colors.success, borderColor: colors.success }]]}
              onPress={() => setTheme(mode)}
            >
              <Ionicons name={mode === 'light' ? 'sunny' : 'moon'} size={16} color={theme === mode ? 'white' : colors.text} style={{ marginRight: 6 }} />
              <Text style={[{ color: theme === mode ? 'white' : colors.text, fontWeight: theme === mode ? '700' : '500' }]}>{mode === 'light' ? 'Light' : 'Dark'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="notifications" size={20} color={colors.success} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        </View>
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.success }]} onPress={scheduleWeeklyReminder}>
          <Ionicons name="calendar" size={18} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Set Weekly Reminder</Text>
        </TouchableOpacity>
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>Get reminded to plan your groceries every week</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 28 },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginLeft: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: "row", gap: 12 },
  chip: {
    flex: 1,
    padding: 13,
    borderWidth: 1.5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  selChip: { borderWidth: 2 },
  btn: {
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  btnText: { color: "white", fontWeight: '700', fontSize: 16 },
  helperText: { fontSize: 12, fontWeight: '400', marginTop: 12, textAlign: 'center' },
});
