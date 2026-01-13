import React, { useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import toast from "react-hot-toast";

// ✅ Define types instead of `any`
type Product = {
  name: string;
  price: number;
  image_url: string;
};

type CartItem = {
  id: number;
  quantity: number;
  products: Product;
};

// ✅ Mocked hooks instead of Supabase
const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      quantity: 2,
      products: {
        name: "Baby Lotion",
        price: 12.99,
        image_url: "https://placehold.co/100x100?text=Lotion",
      },
    },
    {
      id: 2,
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

  return {
    cart,
    cartTotal,
    clearCart: () => setCart([]),
  };
};

type User = {
  id: number;
  email: string;
};

const useAuth = () => {
  return {
    user: { id: 1, email: "test@example.com" } as User, // ✅ typed user
  };
};

type CheckoutProps = {
  onNavigate: (page: string) => void;
};

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      clearCart();
      toast.success("Order placed successfully! 🎉");
      onNavigate("orders");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("There was an error processing your order.");
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    onNavigate("auth");
    return null;
  }

  if (cart.length === 0) {
    onNavigate("cart");
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-peach-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white animate-fade-in-up">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-6 h-6" /> Payment Information
                </h2>
                <input
                  type="text"
                  required
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, cardNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={(e) =>
                      setFormData({ ...formData, cvv: e.target.value })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <Lock className="w-4 h-4 mr-2 text-peach-600 dark:text-peach-400" />
                  <span>Your payment info is secure</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-peach-500 to-peach-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {processing ? "Processing..." : `Pay $${cartTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {item.products.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-peach-600 dark:text-peach-400">
                        ${(item.products.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
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
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
