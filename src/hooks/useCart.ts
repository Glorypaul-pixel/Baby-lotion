import { useState, useEffect } from "react";

type Product = {
  name: string;
  price: number;
  image_url: string;
};

type CartItem = {
  id: string;
  quantity: number;
  products: Product;
};

const CART_STORAGE_KEY = "cart_items";

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // storage full or unavailable — fail silently
  }
}

export const useCart = () => {
  // ✅ Load from localStorage on first render
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  // ✅ Persist to localStorage whenever cart changes
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.products.price * item.quantity,
    0,
  );

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item,
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  return {
    cart,
    cartTotal,
    clearCart,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
};
