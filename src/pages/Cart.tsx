import React, { useState } from "react";
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

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const [user] = useState(true); 
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      product: {
        id: 101,
        name: "Baby Lotion",
        description: "Gentle lotion for soft baby skin",
        price: 12.99,
        image_url: "https://placehold.co/200x200?text=Baby+Lotion",
      },
      quantity: 2,
    },
    {
      id: 2,
      product: {
        id: 102,
        name: "Baby Shampoo",
        description: "Tear-free baby shampoo",
        price: 9.99,
        image_url: "https://placehold.co/200x200?text=Baby+Shampoo",
      },
      quantity: 1,
    },
  ]);

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const updateQuantity = (id: number, newQty: number) => {
    if (newQty <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
    toast.success("Quantity updated!");
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-peach-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 animate-fade-in-up">
            <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Please Sign In
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You need to be signed in to view your cart
            </p>
            <button
              onClick={() => onNavigate("auth")}
              className="px-8 py-4 bg-gradient-to-r from-peach-500 to-peach-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-peach-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 animate-fade-in-up">
            <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Add some products to your cart to get started
            </p>
            <button
              onClick={() => onNavigate("products")}
              className="px-8 py-4 bg-gradient-to-r from-peach-500 to-peach-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-peach-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white animate-fade-in-up">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-peach-100 dark:bg-gray-700 flex-shrink-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {item.product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-peach-600 dark:text-peach-400">
                        ${item.product.price.toFixed(2)}
                      </span>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-peach-100 dark:bg-gray-700 rounded-full p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center hover:bg-peach-200 dark:hover:bg-gray-500 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center hover:bg-peach-200 dark:hover:bg-gray-500 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl sticky top-24 animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400">
                    FREE
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  toast.success("Proceeding to checkout...");
                  onNavigate("checkout");
                }}
                className="w-full py-4 bg-gradient-to-r from-peach-500 to-peach-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => onNavigate("products")}
                className="w-full mt-4 py-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
