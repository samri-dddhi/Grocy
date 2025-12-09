import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { useGroceryStore } from "../../src/store/useGroceryStore";

export default function HistoryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const history = useGroceryStore((s) => s.history);
  const addFromHistory = useGroceryStore((s) => s.addFromHistory);

  if (history.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="time-outline" size={48} color={colors.icon} style={{ marginBottom: 12 }} />
        <Text style={[styles.empty, { color: colors.textSecondary }]}>No purchase history yet.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Purchase History</Text>
      <FlatList
        data={history}
        keyExtractor={(i: any) => i.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }: any) => (
          <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.meta, { color: colors.textSecondary }]}>
                {item.category} · {item.timesPurchased}× purchased
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.success }]}
              onPress={() => addFromHistory(item)}
            >
              <Ionicons name="add-circle" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderRadius: 10,
    borderBottomWidth: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 1,
  },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  meta: { fontSize: 12, fontWeight: '400' },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { fontSize: 16, fontWeight: '500' },
});
