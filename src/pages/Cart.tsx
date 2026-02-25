// src/pages/Cart.tsx
import React from "react";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

type CartProps = {
  onNavigate: (page: string) => void;
};

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart(); // ✅ context, not localStorage
  const { user } = useAuth();

  const handleRemove = (cartItemId: string) => {
    removeFromCart(cartItemId);
    toast.success("Item removed");
  };

  const handleUpdateQty = (cartItemId: string, newQty: number) => {
    if (newQty < 1) return;
    updateQuantity(cartItemId, newQty);
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
            <div key={item.id} className="bg-white rounded-xl p-6 shadow flex gap-6">
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-peach-600">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1 rounded hover:bg-red-50 ml-2"
                    >
                      <Trash2 size={16} className="text-red-500" />
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
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={() => onNavigate("checkout")}
            className="w-full mt-6 py-4 bg-peach-600 text-white rounded-full font-semibold hover:bg-peach-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};