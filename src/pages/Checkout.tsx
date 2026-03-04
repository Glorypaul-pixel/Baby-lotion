// src/pages/Checkout.tsx
import React, { useEffect, useRef, useState } from "react";
import { PaystackButton } from "react-paystack";
import toast from "react-hot-toast";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const CHECKOUT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
  @keyframes heroTitle {
    0%   { opacity:0; transform:perspective(800px) rotateX(90deg) translateY(-40px); filter:blur(16px); }
    60%  { filter:blur(0); }
    100% { opacity:1; transform:perspective(800px) rotateX(0) translateY(0); }
  }
  @keyframes cardFlip {
    0%   { transform:perspective(1000px) rotateY(-8deg) rotateX(4deg) scale(.92); opacity:0; }
    100% { transform:perspective(1000px) rotateY(0) rotateX(0) scale(1); opacity:1; }
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);} }
  @keyframes morphBlob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;}50%{border-radius:50% 60% 30% 40%/70% 30% 50% 60%;}75%{border-radius:40% 30% 60% 70%/30% 70% 40% 50%;} }
  @keyframes floatY { 0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);} }
  @keyframes pulseGlow { 0%,100%{box-shadow:0 0 16px rgba(249,115,22,.25);}50%{box-shadow:0 0 32px rgba(249,115,22,.6),0 0 64px rgba(249,115,22,.15);} }
  @keyframes badgePop { 0%{transform:scale(0) rotate(-20deg);opacity:0;}70%{transform:scale(1.2) rotate(5deg);}85%{transform:scale(.95) rotate(-2deg);}100%{transform:scale(1) rotate(0);opacity:1;} }

  .co-blob { position:absolute; pointer-events:none; animation:morphBlob 9s ease-in-out infinite; filter:blur(2px); }
  .ab-shimmer { background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .co-reveal-up   { opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .co-reveal-up.on { opacity:1; transform:translateY(0); }
  .co-reveal-left { opacity:0; transform:translateX(-32px); transition:opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .co-reveal-left.on { opacity:1; transform:translateX(0); }
  .co-reveal-right { opacity:0; transform:translateX(32px); transition:opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .co-reveal-right.on { opacity:1; transform:translateX(0); }
  .co-field { transition:border-color .25s ease, box-shadow .25s ease, transform .25s ease; }
  .co-field:focus { border-color:#f97316!important; box-shadow:0 0 0 4px rgba(249,115,22,.18); transform:scale(1.012); outline:none; }
  .pay-btn { transition:transform .2s ease, box-shadow .2s ease; position:relative; overflow:hidden; }
  .pay-btn:hover { transform:scale(1.03); box-shadow:0 16px 40px rgba(249,115,22,.4)!important; }
  .pay-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.3) 50%,transparent 60%); transform:translateX(-100%); transition:transform .55s ease; }
  .pay-btn:hover::after { transform:translateX(100%); }
  .summary-item { transition:transform .25s ease; }
  .summary-item:hover { transform:translateX(4px); }
`;

function useCoStyles() {
  useEffect(() => {
    if (document.getElementById("pref-co-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-co-styles";
    s.textContent = CHECKOUT_STYLES;
    document.head.appendChild(s);
  }, []);
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const Reveal: React.FC<{
  children: React.ReactNode;
  type?: "up" | "left" | "right";
  delay?: number;
  className?: string;
}> = ({ children, type = "up", delay = 0, className = "" }) => {
  const { ref, visible } = useInView();
  const cls = {
    up: "co-reveal-up",
    left: "co-reveal-left",
    right: "co-reveal-right",
  }[type];
  return (
    <div
      ref={ref}
      className={`${cls} ${visible ? "on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
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
type CheckoutProps = { onNavigate: (page: string) => void };

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  useCoStyles();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  if (!user) {
    onNavigate("auth");
    return null;
  }
  if (cart.length === 0) {
    onNavigate("cart");
    return null;
  }

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string;
  if (!publicKey) throw new Error("Paystack public key missing");

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
    onSuccess: (res: PaystackSuccessResponse) => {
      clearCart();
      toast.success("✨ Payment successful!");
      onNavigate("orders");
      console.log("ref:", res.reference);
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
    <div
      className="min-h-screen overflow-x-hidden relative"
      style={{
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        background:
          "linear-gradient(135deg,#fff7ed 0%,#fce7f3 50%,#fef9c3 100%)",
      }}
    >
      <div
        className="co-blob w-80 h-80 bg-orange-300 opacity-20 top-[-60px] left-[-60px]"
        style={{ animationDuration: "9s" }}
      />
      <div
        className="co-blob w-56 h-56 bg-pink-300 opacity-15 bottom-10 right-[-40px]"
        style={{ animationDuration: "11s", animationDelay: "3s" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div
          style={{
            animation: ready
              ? "heroTitle .8s cubic-bezier(.22,.68,0,1.2) .05s both"
              : "none",
            opacity: ready ? undefined : 0,
          }}
          className="mb-10"
        >
          <h1
            className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            <span className="ab-shimmer">Checkout</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Complete your order below
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <Reveal type="left" delay={100} className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div
                className="co-blob w-40 h-40 bg-orange-200 opacity-20 -top-10 -right-10"
                style={{ animationDuration: "8s" }}
              />
              <h2
                className="text-2xl font-black mb-6 text-gray-900 dark:text-white relative z-10"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Shipping <span className="ab-shimmer">Information</span>
              </h2>
              <div className="space-y-4 relative z-10">
                {fields.map(({ key, label, type }, i) => (
                  <input
                    key={key}
                    required
                    type={type ?? "text"}
                    placeholder={label}
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    className="co-field w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                    style={{ animation: `fadeUp .5s ease ${i * 60}ms both` }}
                  />
                ))}
              </div>

              <div className="mt-6 relative z-10">
                <PaystackButton
                  {...paystackProps}
                  className="pay-btn w-full py-4 text-white rounded-full font-black text-lg"
                  style={
                    {
                      background: "linear-gradient(135deg,#111827,#374151)",
                    } as React.CSSProperties
                  }
                  text="Pay Now with Paystack"
                />
              </div>
            </div>
          </Reveal>

          {/* Summary */}
          <Reveal type="right" delay={150}>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl sticky top-24 relative overflow-hidden">
              <div
                className="co-blob w-32 h-32 bg-pink-200 opacity-20 -top-8 -right-8"
                style={{ animationDuration: "7s" }}
              />
              <h2
                className="text-2xl font-black mb-6 text-gray-900 dark:text-white relative z-10"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Order <span className="ab-shimmer">Summary</span>
              </h2>
              <div className="space-y-4 mb-6 relative z-10">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item flex gap-3">
                    <div
                      className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ animation: "pulseGlow 3s ease-in-out infinite" }}
                    >
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-black text-sm text-gray-900 dark:text-white truncate"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                      >
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-black text-sm ab-shimmer">
                        ₦{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 relative z-10 space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm font-medium">
                  <span>Subtotal</span>
                  <span>₦{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="ab-shimmer">₦{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
