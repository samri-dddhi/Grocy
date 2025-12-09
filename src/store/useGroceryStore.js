import { create } from "zustand";
import { persist,createJSONStorage  } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Bakery",
  "Snacks",
  "Beverages",
  "Other",
];

export const useGroceryStore = create(
  persist(
    (set, get) => ({
      items: [],
      history: [],
      theme: "light",

      categories: CATEGORIES,   // static (no recomputation)

      addItem: (data) => {
        const newItem = {
          id: Date.now().toString(),
          name: data.name,
          category: data.category,
          quantity: data.quantity || 1,
          notes: data.notes || "",
          isPurchased: false,
          createdAt: Date.now(),
          reminderAt: data.reminderAt || null,
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      toggleItem: (id) => {
        const state = get();
        const updated = state.items.map((i) =>
          i.id === id ? { ...i, isPurchased: !i.isPurchased } : i
        );

        // update history only when marking purchased
        const item = state.items.find((i) => i.id === id);
        if (item && !item.isPurchased) {
          const existing = state.history.find((h) => h.name === item.name);

          let newHistory;
          if (existing) {
            newHistory = state.history.map((h) =>
              h.name === item.name
                ? { ...h, timesPurchased: h.timesPurchased + 1 }
                : h
            );
          } else {
            newHistory = [
              ...state.history,
              {
                id: Date.now().toString(),
                name: item.name,
                category: item.category,
                timesPurchased: 1,
              },
            ];
          }

          set({ history: newHistory });
        }

        set({ items: updated });
      },

      addFromHistory: (item) => {
        set((state) => ({
          items: [
            ...state.items,
            {
              id: Date.now().toString(),
              name: item.name,
              category: item.category,
              quantity: 1,
              notes: "",
              isPurchased: false,
              createdAt: Date.now(),
            },
          ],
        }));
      },

      clearPurchased: () => {
        set((state) => ({
          items: state.items.filter((i) => !i.isPurchased),
        }));
      },

      setTheme: (theme) => set({ theme }),

      getSuggestions: () => {
        const history = get().history;
        return history
          .slice()
          .sort((a, b) => b.timesPurchased - a.timesPurchased)
          .slice(0, 5);
      },
    }),
    {
      name: "smart-grocery-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
