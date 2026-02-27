import React, { createContext, useContext, useState, useCallback } from "react";
import type { Tables } from "@/integrations/supabase/types";

export interface CartItem {
  menuItem: Tables<"menu_items">;
  quantity: number;
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addItem: (item: Tables<"menu_items">, quantity: number, instructions?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  deliveryFee: number;
  setDeliveryFee: (fee: number) => void;
  setRestaurantInfo: (id: string, name: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const setRestaurantInfo = useCallback((id: string, name: string) => {
    setRestaurantId(id);
    setRestaurantName(name);
  }, []);

  const addItem = useCallback((menuItem: Tables<"menu_items">, quantity: number, instructions?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id
            ? { ...i, quantity: i.quantity + quantity, specialInstructions: instructions || i.specialInstructions }
            : i
        );
      }
      return [...prev, { menuItem, quantity, specialInstructions: instructions }];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    setDeliveryFee(0);
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, restaurantId, restaurantName, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount, deliveryFee, setDeliveryFee, setRestaurantInfo }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
