import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "../constants/theme";
import { useGroceryStore } from "../src/store/useGroceryStore";
import { scheduleItemReminder } from "../src/utils/notifications";

export default function AddItemScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const categories = useGroceryStore((s) => s.categories);
  const addItem = useGroceryStore((s) => s.addItem);
  const getSuggestions = useGroceryStore((s) => s.getSuggestions);
  const suggestions = getSuggestions();

  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [qty, setQty] = useState("1");
  const [notes, setNotes] = useState("");
  const [minutes, setMinutes] = useState("");

  const save = async () => {
    if (!name.trim()) return alert("Name required");
    const m = parseInt(minutes) || 0;

    addItem({
      name,
      category,
      quantity: parseInt(qty) || 1,
      notes,
      reminderAt: m > 0 ? Date.now() + m * 60000 : null,
    });

    if (m > 0) scheduleItemReminder(name, m);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} style={{ backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Add Item</Text>
        <View style={{ width: 28 }} />
      </View>

      {suggestions.length > 0 && (
        <>
          <Text style={[styles.label, { color: colors.text }]}>Suggestions</Text>
          <View style={styles.row}>
            {suggestions.map((s: any) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => {
                  setName(s.name);
                  setCategory(s.category);
                }}
              >
                <Text style={{ color: colors.text }}>{s.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Milk, Bread, Eggs..."
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={[styles.label, { color: colors.text }]}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={styles.row}>
          {categories.map((c: string) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }, category === c && [styles.selChip, { backgroundColor: colors.success }]]}
              onPress={() => setCategory(c)}
            >
              <Text style={[{ color: colors.text }, category === c && { color: 'white', fontWeight: '600' }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text style={[styles.label, { color: colors.text }]}>Quantity</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
        value={qty}
        keyboardType="numeric"
        onChangeText={setQty}
        placeholder="1"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={[styles.label, { color: colors.text }]}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, { height: 80, backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, textAlignVertical: 'top' }]}
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder="Add notes..."
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={[styles.label, { color: colors.text }]}>Reminder (minutes)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
        value={minutes}
        keyboardType="numeric"
        onChangeText={setMinutes}
        placeholder="Leave empty for no reminder"
        placeholderTextColor={colors.textSecondary}
      />

      <TouchableOpacity style={styles.btn} onPress={save}>
        <Ionicons name="checkmark" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.btnText}>Save Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: "700", textAlign: 'center', flex: 1 },
  label: { fontWeight: "700", fontSize: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 16 },
  chip: {
    padding: 10,
    borderWidth: 1.5,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  selChip: { borderColor: '#10b981' },
  btn: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  btnText: { textAlign: "center", color: "white", fontWeight: '700', fontSize: 16 },
});
