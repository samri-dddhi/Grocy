import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { useGroceryStore } from "../../src/store/useGroceryStore";

export default function ListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const items = useGroceryStore((s) => s.items);
  const toggleItem = useGroceryStore((s) => s.toggleItem);
  const clearPurchased = useGroceryStore((s) => s.clearPurchased);

  const totalCount = items.length;
  const remaining = items.filter((i: any) => !i.isPurchased).length;

  const grouped = items.reduce((acc: any, item: any) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const sections = Object.entries(grouped).map(([cat, data]) => ({
    title: cat,
    data,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.brandBlock}>
        <Text style={[styles.brandName, { color: colors.text }]}>🛒 Grocy</Text>
        <Text style={[styles.brandTag, { color: colors.textSecondary }]}>Smarter Lists. Simpler Shopping.</Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={[styles.metricPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Total Items</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>{totalCount}</Text>
        </View>
        <View style={[styles.metricPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Remaining</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>{remaining}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Shopping List</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{remaining} items remaining</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/add-item")}>
          <Ionicons name="add" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      {sections.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="cart-outline" size={48} color={colors.icon} style={{ marginBottom: 12 }} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No groceries yet. Add something!</Text>
        </View>
      ) : (
        <SectionList
          sections={sections as any}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderSectionHeader={({ section }: any) => (
            <Text style={[styles.category, { color: colors.text }]}>{section.title}</Text>
          )}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              style={[styles.itemRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }, item.isPurchased && styles.done]}
              onPress={() => toggleItem(item.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { color: colors.text, textDecorationLine: item.isPurchased ? 'line-through' : 'none' }]}>
                  {item.name} {item.quantity > 1 ? `×${item.quantity}` : ""}
                </Text>
                {item.notes ? <Text style={[styles.notes, { color: colors.textSecondary }]}>{item.notes}</Text> : null}
              </View>
              <Ionicons
                name={item.isPurchased ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={item.isPurchased ? colors.success : colors.icon}
              />
            </TouchableOpacity>
          )}
        />
      )}

      {items.some((i: any) => i.isPurchased) && (
        <TouchableOpacity style={[styles.clearBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={clearPurchased}>
          <Ionicons name="trash-outline" size={18} color={colors.error} style={{ marginRight: 8 }} />
          <Text style={{ color: colors.error, fontWeight: '600' }}>Clear purchased items</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  brandBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 6,
  },
  brandName: { fontSize: 30, fontWeight: "900", letterSpacing: 0.8 },
  brandTag: { fontSize: 14, fontWeight: "600", marginTop: 6,marginLeft: 20,marginBottom: 8, textAlign: 'center' },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  metricPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  metricLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' },
  metricValue: { fontSize: 18, fontWeight: '800' },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 26,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    height: 20,
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 4 },
  sectionTitle: { fontSize: 14, fontWeight: "700", letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 },
  subtitle: { fontSize: 14, fontWeight: "500" },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: { fontSize: 16, fontWeight: '500' },
  category: { fontWeight: "700", paddingTop: 16, paddingBottom: 8, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 10,
    borderBottomWidth: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  done: { opacity: 0.5 },
  itemName: { fontSize: 15, fontWeight: "600" },
  notes: { fontSize: 12, fontWeight: '400', marginTop: 4 },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    marginVertical: 16,
  },
});
