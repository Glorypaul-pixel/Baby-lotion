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
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// ----------------------
// MOCK DATA
// ----------------------
const mockCart: CartItem[] = [
  {
    id: "1",
    product: {
      id: "p1",
      name: "Baby Lotion",
      price: 12.99,
      category: "baby_lotion",
      image_url: "https://placehold.co/100x100?text=Lotion",
      stock: 10,
      is_featured: true,
      description: "Gentle baby lotion",
      created_at: "2026-01-26",
    },
    quantity: 2,
  },
  {
    id: "2",
    product: {
      id: "p2",
      name: "Soft Soap",
      price: 5.5,
      category: "soap",
      image_url: "https://placehold.co/100x100?text=Soap",
      stock: 0,
      is_featured: false,
      description: "Mild soap",
      created_at: "2026-01-26",
    },
    quantity: 1,
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(mockCart);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);

  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing) {
        return prev.map(item =>
          item.product.id === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return prev;
    });
  };

  const removeFromCart = (cartItemId: string) => setCart(prev => prev.filter(item => item.id !== cartItemId));

  const updateQuantity = (cartItemId: string, quantity: number) =>
    setCart(prev => prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item)));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
