// src/pages/Checkout.tsx
import React, { useState } from "react";
import { PaystackButton } from "react-paystack";
import toast from "react-hot-toast";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

type PaystackSuccessResponse = {
  reference: string;
  status: "success";
  message: string;
  transaction?: string;
};

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

type CheckoutProps = {
  onNavigate: (page: string) => void;
};

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const { cart, cartTotal, clearCart } = useCart(); // ✅ real context
  const { user } = useAuth();                        // ✅ real auth

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Guards
  if (!user) {
    onNavigate("auth");
    return null;
  }
  if (cart.length === 0) {
    onNavigate("cart");
    return null;
  }

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string;
  if (!publicKey) throw new Error("Paystack public key is missing");

  const paystackProps = {
    email: formData.email,
    amount: Math.round(cartTotal * 100),
    publicKey,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: formData.fullName,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone",
          value: formData.phone,
        },
      ],
    },
    onSuccess: (response: PaystackSuccessResponse) => {
      clearCart();
      toast.success("Payment successful!");
      onNavigate(`orders`);
      console.log("Payment reference:", response.reference);
    },
    onClose: () => toast.error("Payment cancelled"),
  };

  const fields: { key: keyof FormData; label: string; type?: string }[] = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "zipCode", label: "Zip Code" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Shipping Information
              </h2>
              <div className="space-y-4">
                {fields.map(({ key, label, type }) => (
                  <input
                    key={key}
                    required
                    type={type ?? "text"}
                    placeholder={label}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peach-400"
                  />
                ))}
              </div>
            </div>

            <PaystackButton
              {...paystackProps}
              className="w-full py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition mt-4"
            />
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ₦{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₦{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>₦{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};