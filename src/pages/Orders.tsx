import React, { useEffect, useRef, useState } from "react";
import { Package, Truck, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

type Order = {
  id: string;
  status: "delivered" | "shipped" | "cancelled" | "processing";
  created_at: string;
  total_amount: number;
  shipping_address: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
};
type OrdersProps = { onNavigate: (page: string) => void };

const STYLES = `
  @keyframes heroTitle{0%{opacity:0;transform:perspective(800px) rotateX(90deg) translateY(-40px);filter:blur(16px);}60%{filter:blur(0);}100%{opacity:1;transform:perspective(800px) rotateX(0) translateY(0);}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
  @keyframes morphBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;}50%{border-radius:50% 60% 30% 40%/70% 30% 50% 60%;}75%{border-radius:40% 30% 60% 70%/30% 70% 40% 50%;}}
  @keyframes badgePop{0%{transform:scale(0) rotate(-20deg);opacity:0;}70%{transform:scale(1.2) rotate(5deg);}85%{transform:scale(.95) rotate(-2deg);}100%{transform:scale(1) rotate(0);opacity:1;}}
  @keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
  @keyframes shimmerSkel{0%{transform:translateX(-100%);}100%{transform:translateX(100%);}}
  @keyframes statusPop{0%{transform:scale(0);opacity:0;}70%{transform:scale(1.15);}100%{transform:scale(1);opacity:1;}}
  @keyframes dotBounce{0%,100%{transform:translateY(0);opacity:.5;}50%{transform:translateY(-8px);opacity:1;}}
  @keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
  .ord-blob{position:absolute;pointer-events:none;animation:morphBlob 9s ease-in-out infinite;filter:blur(2px);}
  .ab-shimmer{background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .ord-reveal{opacity:0;transform:translateX(-32px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,.68,0,1.2);}
  .ord-reveal.on{opacity:1;transform:translateX(0);}
  .ord-reveal-up{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,.68,0,1.2);}
  .ord-reveal-up.on{opacity:1;transform:translateY(0);}
  .ord-card{transition:transform .35s cubic-bezier(.22,.68,0,1.2),box-shadow .35s ease;}
  .ord-card:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 20px 48px rgba(249,115,22,.12)!important;}
  .status-badge{animation:statusPop .5s cubic-bezier(.22,.68,0,1.4) both;}
  .ord-btn{transition:transform .2s ease,box-shadow .2s ease;position:relative;overflow:hidden;}
  .ord-btn:hover{transform:scale(1.04);box-shadow:0 12px 32px rgba(249,115,22,.35);}
  .ord-btn::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.3) 50%,transparent 60%);transform:translateX(-100%);transition:transform .55s ease;}
  .ord-btn:hover::after{transform:translateX(100%);}
  .empty-float{animation:floatY 3s ease-in-out infinite;}
  .dot-1{animation:dotBounce .9s ease-in-out 0s infinite;}
  .dot-2{animation:dotBounce .9s ease-in-out .15s infinite;}
  .dot-3{animation:dotBounce .9s ease-in-out .3s infinite;}
  .tick-track{animation:ticker 24s linear infinite;display:flex;width:max-content;}
  .tick-wrap{overflow:hidden;}
  @media(hover:none){.ord-blob{display:none;}}
`;

function useStyles() {
  useEffect(() => {
    if (document.getElementById("pref-ord-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-ord-styles";
    s.textContent = STYLES;
    document.head.appendChild(s);
  }, []);
}

// ✅ Hook is always called at the top level of this helper component
function useInView(t = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          obs.disconnect();
        }
      },
      { threshold: t },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [t]);
  return { ref, v };
}

const STATUS = {
  delivered: { icon: CheckCircle, color: "#22c55e", label: "Delivered" },
  shipped: { icon: Truck, color: "#3b82f6", label: "Shipped" },
  cancelled: { icon: XCircle, color: "#ef4444", label: "Cancelled" },
  processing: { icon: Package, color: "#f97316", label: "Processing" },
};

// ✅ Extracted into its own component so useInView is called at the top level
const OrderCard: React.FC<{ order: Order; index: number }> = ({
  order,
  index,
}) => {
  const { ref, v } = useInView(); // top-level hook call ✅
  const cfg = STATUS[order.status] ?? STATUS.processing;
  const Icon = cfg.icon;

  return (
    <div
      ref={ref}
      className={`ord-reveal ${v ? "on" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="ord-card bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl"
          style={{ background: `linear-gradient(180deg,${cfg.color},#ec4899)` }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-5 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${cfg.color}22` }}
            >
              <Icon
                className="w-5 h-5 sm:w-6 sm:h-6"
                style={{ color: cfg.color }}
              />
            </div>
            <div>
              <h3
                className="text-base sm:text-lg font-black text-gray-900 dark:text-white"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                Order #{order.id.toUpperCase()}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span
              className="status-badge px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-black text-white"
              style={{
                background: `linear-gradient(135deg,${cfg.color},#ec4899)`,
                animationDelay: `${index * 100 + 200}ms`,
              }}
            >
              {cfg.label}
            </span>
            <span className="text-xl sm:text-2xl font-black ab-shimmer">
              ${order.total_amount.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 sm:pt-4">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2">
            Shipping Address
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words">
            {order.shipping_address.fullName}
            <br />
            {order.shipping_address.address}
            <br />
            {order.shipping_address.city}, {order.shipping_address.state}{" "}
            {order.shipping_address.zipCode}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Orders: React.FC<OrdersProps> = ({ onNavigate }) => {
  useStyles();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setOrders([
          {
            id: "abc123",
            status: "shipped",
            created_at: new Date().toISOString(),
            total_amount: 49.99,
            shipping_address: {
              fullName: "John Doe",
              address: "123 Baby St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
            },
          },
          {
            id: "xyz789",
            status: "delivered",
            created_at: new Date().toISOString(),
            total_amount: 29.99,
            shipping_address: {
              fullName: "Jane Smith",
              address: "456 Care Ave",
              city: "Los Angeles",
              state: "CA",
              zipCode: "90001",
            },
          },
        ]);
      } catch {
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ticks = [
    "✦ MY ORDERS",
    "✦ ORDER TRACKING",
    "✦ DELIVERY STATUS",
    "✦ ORDER HISTORY",
    "✦ PREFERABLE",
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
        className="ord-blob w-80 h-80 bg-orange-300 opacity-20 hidden sm:block"
        style={{
          position: "absolute",
          top: "-60px",
          left: "-60px",
          animationDuration: "9s",
        }}
      />
      <div
        className="ord-blob w-60 h-60 bg-pink-300 opacity-15 hidden sm:block"
        style={{
          position: "absolute",
          bottom: "60px",
          right: "-40px",
          animationDuration: "11s",
          animationDelay: "3s",
        }}
      />
      <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 text-center z-10 px-4">
        <div
          className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-xs sm:text-sm font-black mb-4 sm:mb-6"
          style={{
            background: "linear-gradient(135deg,#f97316,#ec4899,#fbbf24)",
            animation: ready
              ? "badgePop .6s cubic-bezier(.22,.68,0,1.4) both"
              : "none",
            opacity: ready ? undefined : 0,
          }}
        >
          MY ACCOUNT
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black mb-3"
          style={{
            fontFamily: "Syne,sans-serif",
            animation: ready
              ? "heroTitle 1s cubic-bezier(.22,.68,0,1.2) .1s both"
              : "none",
            opacity: ready ? undefined : 0,
          }}
        >
          <span className="ab-shimmer">My</span> Orders
        </h1>
        <p
          className={`text-base sm:text-xl text-gray-600 ord-reveal-up ${ready ? "on" : ""}`}
          style={{ transitionDelay: "350ms" }}
        >
          Track and manage all your purchases
        </p>
      </section>
      <div
        className="tick-wrap py-2.5 sm:py-3 mb-8 sm:mb-10"
        style={{
          background: "linear-gradient(90deg,#f97316,#ec4899)",
          borderTop: "2px solid #fbbf24",
          borderBottom: "2px solid #fbbf24",
        }}
      >
        <div className="tick-track">
          {[...ticks, ...ticks].map((t, i) => (
            <span
              key={i}
              className="text-white font-black text-xs sm:text-sm tracking-widest px-5 sm:px-8 flex-shrink-0"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-md h-28 sm:h-32 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{
                    animation: `shimmerSkel 1.5s ease ${i * 0.2}s infinite`,
                  }}
                />
                <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-300 dot-1" />
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-300 dot-2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 dot-3" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div
            className="text-center py-16 sm:py-20"
            style={{ animation: "fadeUp .7s ease both" }}
          >
            <Package
              className="empty-float w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-5 sm:mb-6"
              style={{ color: "#f97316" }}
            />
            <h2
              className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              No Orders <span className="ab-shimmer">Yet</span>
            </h2>
            <p className="text-gray-500 mb-6 sm:mb-8 text-base sm:text-lg">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => onNavigate("products")}
              className="ord-btn px-8 sm:px-10 py-3.5 sm:py-4 text-white rounded-full font-black text-base sm:text-lg inline-flex items-center gap-2"
              style={{ background: "linear-gradient(135deg,#f97316,#ec4899)" }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Shop Now
            </button>
          </div>
        ) : (
          // ✅ No hooks inside .map() — OrderCard handles its own hook
          <div className="space-y-4 sm:space-y-5">
            {orders.map((order, i) => (
              <OrderCard key={order.id} order={order} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
