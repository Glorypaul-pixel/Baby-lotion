// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  is_featured: boolean;
  description: string;
  created_at: string;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  cartTotal: number;
  cartCount: number; // ✅ total number of items for the navbar badge
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        // ✅ Increment quantity if already in cart
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // ✅ Add new item — this was the missing branch
      const newItem: CartItem = {
        id: product.id, // use product.id as the cart item id
        product,
        quantity,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) =>
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));

  const updateQuantity = (cartItemId: string, quantity: number) =>
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, cartTotal, cartCount, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};