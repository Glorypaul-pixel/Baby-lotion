import { useState } from "react";

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

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "1",
      quantity: 2,
      products: {
        name: "Baby Lotion",
        price: 12.99,
        image_url: "https://placehold.co/100x100?text=Lotion",
      },
    },
    {
      id: "2",
      quantity: 1,
      products: {
        name: "Soft Blanket",
        price: 25.5,
        image_url: "https://placehold.co/100x100?text=Blanket",
      },
    },
  ]);

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.products.price * item.quantity,
    0
  );

  const clearCart = () => setCart([]);

  const addToCart = (newItem: CartItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  return { cart, cartTotal, clearCart, addToCart, removeFromCart, updateQuantity };
};
