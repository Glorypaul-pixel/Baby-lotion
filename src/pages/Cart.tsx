// src/pages/Cart.tsx
import React, { useEffect, useRef, useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const CART_STYLES = `
  @keyframes heroTitle {
    0%   { opacity:0; transform: perspective(800px) rotateX(90deg) translateY(-40px); filter:blur(16px); }
    60%  { filter:blur(0); }
    100% { opacity:1; transform: perspective(800px) rotateX(0) translateY(0); }
  }
  @keyframes cardFlip {
    0%   { transform: perspective(1000px) rotateY(-8deg) rotateX(4deg) scale(.92); opacity:0; }
    100% { transform: perspective(1000px) rotateY(0) rotateX(0) scale(1); opacity:1; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes morphBlob {
    0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
    25%      { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; }
    50%      { border-radius:50% 60% 30% 40%/70% 30% 50% 60%; }
    75%      { border-radius:40% 30% 60% 70%/30% 70% 40% 50%; }
  }
  @keyframes floatY {
    0%,100% { transform:translateY(0); }
    50%      { transform:translateY(-10px); }
  }
  @keyframes badgePop {
    0%   { transform:scale(0) rotate(-20deg); opacity:0; }
    70%  { transform:scale(1.2) rotate(5deg); }
    85%  { transform:scale(.95) rotate(-2deg); }
    100% { transform:scale(1) rotate(0); opacity:1; }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow:0 0 20px rgba(249,115,22,.3); }
    50%      { box-shadow:0 0 40px rgba(249,115,22,.65),0 0 80px rgba(249,115,22,.2); }
  }
  @keyframes countBounce {
    0%  { transform:scale(1); }
    40% { transform:scale(1.3); }
    70% { transform:scale(.9); }
    100%{ transform:scale(1); }
  }
  @keyframes addItem {
    from { opacity:0; transform:translateX(-30px) scale(.9); }
    to   { opacity:1; transform:translateX(0) scale(1); }
  }

  .cart-blob { position:absolute; pointer-events:none; animation:morphBlob 9s ease-in-out infinite; filter:blur(2px); }
  .ab-shimmer { background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .cart-reveal-up   { opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .cart-reveal-up.on { opacity:1; transform:translateY(0); }
  .cart-reveal-left  { opacity:0; transform:translateX(-32px); transition:opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .cart-reveal-left.on { opacity:1; transform:translateX(0); }
  .cart-reveal-right { opacity:0; transform:translateX(32px); transition:opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .cart-reveal-right.on { opacity:1; transform:translateX(0); }
  .cart-item { animation:addItem .5s cubic-bezier(.22,.68,0,1.2) both; transition:box-shadow .3s ease, transform .3s ease; }
  .cart-item:hover { transform:translateX(4px); box-shadow:0 8px 32px rgba(249,115,22,.15); }
  .cart-remove { transition:transform .2s ease, color .2s ease; }
  .cart-remove:hover { transform:scale(1.2) rotate(10deg); color:#ef4444; }
  .qty-btn { transition:transform .15s ease, background .2s ease; }
  .qty-btn:hover { transform:scale(1.2); background:rgba(249,115,22,.12) !important; }
  .qty-btn:active { transform:scale(.9); }
  .checkout-btn { transition:transform .2s ease, box-shadow .2s ease; position:relative; overflow:hidden; }
  .checkout-btn:hover { transform:scale(1.03); box-shadow:0 16px 40px rgba(249,115,22,.4); }
  .checkout-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.3) 50%,transparent 60%); transform:translateX(-100%); transition:transform .55s ease; }
  .checkout-btn:hover::after { transform:translateX(100%); }
  .empty-icon { animation:floatY 3s ease-in-out infinite; }
  @media(hover:none){.cart-blob{display:none;}}
`;

function useCartStyles() {
  useEffect(() => {
    if (document.getElementById("pref-cart-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-cart-styles";
    s.textContent = CART_STYLES;
    document.head.appendChild(s);
  }, []);
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const Reveal: React.FC<{ children: React.ReactNode; type?: "up"|"left"|"right"; delay?: number; className?: string }> = ({
  children, type="up", delay=0, className=""
}) => {
  const { ref, visible } = useInView();
  const cls = { up:"cart-reveal-up", left:"cart-reveal-left", right:"cart-reveal-right" }[type];
  return (
    <div ref={ref} className={`${cls} ${visible?"on":""} ${className}`} style={{ transitionDelay:`${delay}ms` }}>
      {children}
    </div>
  );
};

type CartProps = { onNavigate: (page: string) => void };

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  useCartStyles();
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  const handleRemove = (id: string) => { removeFromCart(id); toast.success("Item removed"); };
  const handleQty    = (id: string, qty: number) => { if (qty < 1) return; updateQuantity(id, qty); };

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4" style={{ background:"linear-gradient(135deg,#fff7ed,#fce7f3,#fef9c3)" }}>
      <div className="cart-blob w-72 h-72 bg-orange-300 opacity-20 top-0 left-0 hidden sm:block" style={{ animationDuration:"9s" }} />
      <div className="cart-blob w-56 h-56 bg-pink-300 opacity-15 bottom-0 right-0 hidden sm:block" style={{ animationDuration:"11s" }} />
      <div className="relative z-10 text-center" style={{ animation:"fadeUp .7s ease both" }}>
        <ShoppingBag className="empty-icon w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-5 sm:mb-6" style={{ color:"#f97316" }} />
        <h2 className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4 text-gray-900" style={{ fontFamily:"'Syne',sans-serif" }}>
          <span className="ab-shimmer">Please Sign In</span>
        </h2>
        <p className="text-gray-500 mb-6 sm:mb-8 text-base sm:text-lg">Sign in to view your cart and checkout</p>
        <button onClick={() => onNavigate("auth")} className="checkout-btn px-8 sm:px-10 py-3.5 sm:py-4 text-white rounded-full font-black text-base sm:text-lg" style={{ background:"linear-gradient(135deg,#f97316,#ec4899)" }}>
          Sign In <ArrowRight className="inline w-4 h-4 sm:w-5 sm:h-5 ml-1" />
        </button>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4" style={{ background:"linear-gradient(135deg,#fff7ed,#fce7f3,#fef9c3)" }}>
      <div className="cart-blob w-72 h-72 bg-orange-300 opacity-20 top-0 left-0 hidden sm:block" style={{ animationDuration:"9s" }} />
      <div className="cart-blob w-56 h-56 bg-pink-300 opacity-15 bottom-0 right-0 hidden sm:block" style={{ animationDuration:"11s" }} />
      <div className="relative z-10 text-center" style={{ animation:"fadeUp .7s ease both" }}>
        <ShoppingBag className="empty-icon w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-5 sm:mb-6" style={{ color:"#f97316" }} />
        <h2 className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4 text-gray-900" style={{ fontFamily:"'Syne',sans-serif" }}>
          Your Cart is <span className="ab-shimmer">Empty</span>
        </h2>
        <p className="text-gray-500 mb-6 sm:mb-8 text-base sm:text-lg">Looks like you haven't added anything yet</p>
        <button onClick={() => onNavigate("products")} className="checkout-btn px-8 sm:px-10 py-3.5 sm:py-4 text-white rounded-full font-black text-base sm:text-lg" style={{ background:"linear-gradient(135deg,#f97316,#ec4899)" }}>
          Shop Now <Sparkles className="inline w-4 h-4 sm:w-5 sm:h-5 ml-1" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:"linear-gradient(135deg,#fff7ed 0%,#fce7f3 50%,#fef9c3 100%)" }}>
      <div className="cart-blob w-80 h-80 bg-orange-300 opacity-20 top-[-60px] left-[-60px] hidden sm:block" style={{ animationDuration:"9s" }} />
      <div className="cart-blob w-56 h-56 bg-pink-300 opacity-15 bottom-20 right-[-40px] hidden sm:block" style={{ animationDuration:"11s", animationDelay:"3s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div style={{ animation: ready ? "heroTitle .8s cubic-bezier(.22,.68,0,1.2) .05s both" : "none", opacity: ready ? undefined : 0 }} className="mb-8 sm:mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
            Your <span className="ab-shimmer">Cart</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium text-sm sm:text-base">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item, i) => (
              <Reveal key={item.id} type="left" delay={i * 80}>
                <div className="cart-item bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-md flex gap-3 sm:gap-5 relative overflow-hidden" style={{ animationDelay:`${i*80}ms` }}>
                  <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background:"linear-gradient(180deg,#f97316,#ec4899)" }} />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0" style={{ animation:`pulseGlow 3s ease-in-out ${i*.5}s infinite` }}>
                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white truncate" style={{ fontFamily:"'Syne',sans-serif" }}>{item.product.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-1">{item.product.description}</p>
                    <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
                      <span className="text-lg sm:text-xl font-black ab-shimmer">${(item.product.price * item.quantity).toFixed(2)}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleQty(item.id, item.quantity - 1)} className="qty-btn w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Minus size={12} />
                        </button>
                        <span className="w-7 sm:w-8 text-center font-black text-gray-900 dark:text-white text-sm" style={{ animation:"countBounce .3s ease" }}>{item.quantity}</span>
                        <button onClick={() => handleQty(item.id, item.quantity + 1)} className="qty-btn w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Plus size={12} />
                        </button>
                        <button onClick={() => handleRemove(item.id)} className="cart-remove w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center ml-1">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Summary */}
          <Reveal type="right" delay={100}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl lg:sticky lg:top-24 relative overflow-hidden">
              <div className="cart-blob w-32 h-32 bg-orange-200 opacity-20 -top-8 -right-8 hidden sm:block" style={{ animationDuration:"7s" }} />
              <h2 className="text-xl sm:text-2xl font-black mb-5 sm:mb-6 text-gray-900 dark:text-white relative z-10" style={{ fontFamily:"'Syne',sans-serif" }}>
                Order <span className="ab-shimmer">Summary</span>
              </h2>
              <div className="space-y-2 sm:space-y-3 mb-4 relative z-10">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <span className="truncate mr-2">{item.product.name} ×{item.quantity}</span>
                    <span className="font-bold flex-shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-5 sm:mb-6 relative z-10">
                <div className="flex justify-between text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="ab-shimmer">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate("checkout")}
                className="checkout-btn w-full py-3.5 sm:py-4 text-white rounded-full font-black text-base sm:text-lg flex items-center justify-center gap-2 relative z-10"
                style={{ background:"linear-gradient(135deg,#f97316,#ec4899)" }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                Proceed to Checkout
              </button>
              <button
                onClick={() => onNavigate("products")}
                className="w-full mt-3 py-3 text-gray-500 dark:text-gray-400 rounded-full font-bold text-xs sm:text-sm hover:text-orange-500 transition-colors relative z-10"
              >
                Continue Shopping
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};