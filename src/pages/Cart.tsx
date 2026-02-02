import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

type CartItem = {
  id: number;
  product: Product;
  quantity: number;
};

type CartProps = {
  onNavigate: (page: string) => void;
};

const CART_KEY = "app_cart";

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const [user] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_KEY);
    if (storedCart) {
      setCart(JSON.parse(storedCart) as CartItem[]);
    }
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const updateQuantity = (id: number, newQty: number) => {
    if (newQty < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed");
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-400" />
        <h2 className="text-3xl font-bold mb-4">Please Sign In</h2>
        <button
          onClick={() => onNavigate("auth")}
          className="px-8 py-4 bg-peach-600 text-white rounded-full"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-400" />
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <button
          onClick={() => onNavigate("products")}
          className="px-8 py-4 bg-peach-600 text-white rounded-full"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-6 shadow flex gap-6"
            >
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-24 h-24 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {item.product.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-peach-600">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus />
                    </button>
                    <button onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => onNavigate("checkout")}
            className="w-full mt-6 py-4 bg-peach-600 text-white rounded-full"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
