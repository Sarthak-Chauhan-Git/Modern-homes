import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  getSubtotal: (type: "retail" | "wholesale") => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        set((s) => {
          const existing = s.items.find(
            (i) => i.product_id === item.product_id,
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, qty: i.qty + item.qty }
                  : i,
              ),
            };
          }
          return { items: [...s.items, item] };
        });
      },
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.product_id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.product_id !== id)
              : s.items.map((i) => (i.product_id === id ? { ...i, qty } : i)),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      getSubtotal: (type) =>
        get().items.reduce((sum, i) => {
          const price =
            type === "wholesale" ? i.price_wholesale : i.price_retail;
          return sum + price * i.qty;
        }, 0),
    }),
    { name: "mh-cart" },
  ),
);
