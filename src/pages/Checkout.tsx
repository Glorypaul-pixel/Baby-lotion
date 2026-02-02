import React, { useState } from "react";
import { PaystackButton } from "react-paystack";
import toast from "react-hot-toast";

/* ===================== TYPES ===================== */
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

/* ===================== MOCK HOOKS ===================== */
// Replace this with your actual cart hook or context
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
  const clearCart = () => setCart([]);
  return { cart, cartTotal, clearCart };
};

/* ===================== COMPONENT ===================== */
type CheckoutProps = {
  onNavigate: (page: string) => void;
};

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const { cart, cartTotal, clearCart } = useCart();

  // Temporary user (replace with your real auth logic)
  const user = {
    id: "1",
    email: "client@example.com",
  };

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

  // Paystack config
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
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
      onNavigate(`/orders?reference=${response.reference}`);
    },
    onClose: () => toast.error("Payment cancelled"),
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow">
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
              <div className="space-y-4">
                {[
                  "fullName",
                  "email",
                  "phone",
                  "address",
                  "city",
                  "state",
                  "zipCode",
                ].map((field) => (
                  <input
                    key={field}
                    required
                    type={field === "email" ? "email" : "text"}
                    placeholder={field[0].toUpperCase() + field.slice(1)}
                    value={formData[field as keyof FormData]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                ))}
              </div>
            </div>

            <PaystackButton
              {...paystackProps}
              className="w-full py-4 bg-black text-white rounded-full font-semibold mt-4"
            />
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item: CartItem) => (
                  <div key={item.id} className="flex space-x-3">
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-16 h-16 rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {item.products.name}
                      </h4>
                      <p className="text-sm">Qty: {item.quantity}</p>
                      <p className="font-semibold">
                        ₦{(item.products.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
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
