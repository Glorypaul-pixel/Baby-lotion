// src/pages/Products.tsx
import React, { useEffect, useRef, useState } from "react";
import { Star, Filter, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { useProducts, type Product } from "../hooks/useProducts";
import { useCart } from "../contexts/CartContext";
import { getAccessToken } from "../contexts/AuthContext";

type ProductsProps = { onNavigate: (page: string) => void };
const CATEGORIES = [
  { id: "all", name: "All Products" },
  { id: "baby soap", name: "Baby Soap" },
  { id: "baby lotion", name: "Baby Lotion" },
  { id: "adult lotion", name: "Baby Body Wash" },
];

const STYLES = `
  @keyframes heroTitle{0%{opacity:0;transform:perspective(800px) rotateX(90deg) translateY(-40px);filter:blur(16px);}60%{filter:blur(0);}100%{opacity:1;transform:perspective(800px) rotateX(0) translateY(0);}}
  @keyframes cardFlip{0%{transform:perspective(1000px) rotateY(-8deg) rotateX(4deg) scale(.92);opacity:0;}100%{transform:perspective(1000px) rotateY(0) rotateX(0) scale(1);opacity:1;}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
  @keyframes morphBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;}50%{border-radius:50% 60% 30% 40%/70% 30% 50% 60%;}75%{border-radius:40% 30% 60% 70%/30% 70% 40% 50%;}}
  @keyframes badgePop{0%{transform:scale(0) rotate(-20deg);opacity:0;}70%{transform:scale(1.2) rotate(5deg);}85%{transform:scale(.95) rotate(-2deg);}100%{transform:scale(1) rotate(0);opacity:1;}}
  @keyframes shimmerSkel{0%{transform:translateX(-100%);}100%{transform:translateX(100%);}}
  @keyframes waveText{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
  @keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
  @keyframes dotBounce{0%,100%{transform:translateY(0);opacity:.5;}50%{transform:translateY(-8px);opacity:1;}}
  @keyframes stockFade{from{opacity:0;transform:scale(.8);}to{opacity:1;transform:scale(1);}}
  @keyframes explode{0%{opacity:1;transform:translate(0,0) scale(1);}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0);}}
  .pr-blob{position:absolute;pointer-events:none;animation:morphBlob 9s ease-in-out infinite;filter:blur(2px);}
  .ab-shimmer{background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .pr-reveal-up{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,.68,0,1.2);}
  .pr-reveal-up.on{opacity:1;transform:translateY(0);}
  .pr-flip{opacity:0;}
  .pr-flip.on{animation:cardFlip .65s cubic-bezier(.22,.68,0,1.2) both;}
  .pr-card{transition:transform .35s cubic-bezier(.22,.68,0,1.2),box-shadow .35s ease;}
  .pr-card:hover{transform:translateY(-10px) scale(1.02);box-shadow:0 24px 48px rgba(249,115,22,.15)!important;}
  .img-zoom{transition:transform .6s cubic-bezier(.22,.68,0,1.2);}
  .pr-card:hover .img-zoom{transform:scale(1.09);}
  .add-btn{transition:transform .2s ease,box-shadow .2s ease;position:relative;overflow:hidden;}
  .add-btn:not(:disabled):hover{transform:scale(1.04);box-shadow:0 10px 28px rgba(249,115,22,.35);}
  .add-btn::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.3) 50%,transparent 60%);transform:translateX(-100%);transition:transform .55s ease;}
  .add-btn:not(:disabled):hover::after{transform:translateX(100%);}
  .cat-btn{transition:transform .2s cubic-bezier(.22,.68,0,1.4),box-shadow .2s ease;}
  .cat-btn:hover{transform:scale(1.07);}
  .tick-track{animation:ticker 24s linear infinite;display:flex;width:max-content;}
  .tick-wrap{overflow:hidden;}
  .dot-1{animation:dotBounce .9s ease-in-out 0s infinite;}
  .dot-2{animation:dotBounce .9s ease-in-out .15s infinite;}
  .dot-3{animation:dotBounce .9s ease-in-out .3s infinite;}
  .star-i{display:inline-block;}
  .star-row:hover .star-i{animation:waveText .8s ease both;}
  .star-row:hover .star-i:nth-child(1){animation-delay:0ms;} .star-row:hover .star-i:nth-child(2){animation-delay:60ms;} .star-row:hover .star-i:nth-child(3){animation-delay:120ms;} .star-row:hover .star-i:nth-child(4){animation-delay:180ms;} .star-row:hover .star-i:nth-child(5){animation-delay:240ms;}
  @media(hover:none){.pr-blob{display:none;}}
`;

function useStyles() {
  useEffect(() => {
    if (document.getElementById("pref-pr-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-pr-styles";
    s.textContent = STYLES;
    document.head.appendChild(s);
  }, []);
}

function useInView(t = 0.1) {
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

function useTilt(str = 8) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mv = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * str}deg) rotateX(${-y * str}deg) scale(1.03)`;
    };
    const lv = () => {
      el.style.transition = "transform .5s ease";
      el.style.transform = "";
    };
    const en = () => {
      el.style.transition = "transform .1s ease";
    };
    el.addEventListener("mousemove", mv);
    el.addEventListener("mouseleave", lv);
    el.addEventListener("mouseenter", en);
    return () => {
      el.removeEventListener("mousemove", mv);
      el.removeEventListener("mouseleave", lv);
      el.removeEventListener("mouseenter", en);
    };
  }, [str]);
  return ref;
}

// ✅ Fixed: a and d are now used to compute tx/ty for outward burst direction
function spawnParticles(x: number, y: number) {
  const colors = ["#f97316", "#ec4899", "#fbbf24", "#84cc16"];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");
    const angle = (i / 12) * Math.PI * 2;
    const dist = 40 + Math.random() * 50;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    const sz = 5 + Math.random() * 6;
    p.style.cssText = `position:fixed;border-radius:50%;pointer-events:none;z-index:9999;left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;background:${colors[Math.floor(Math.random() * colors.length)]};--tx:${tx}px;--ty:${ty}px;animation:explode .7s ease-out forwards;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

const ProductCard: React.FC<{
  product: Product;
  onAdd: (p: Product) => void; // ✅ Fixed: removed unused `e` param from signature
  delay: number;
}> = ({ product, onAdd, delay }) => {
  const tilt = useTilt(7);
  const { ref, v } = useInView();
  return (
    <div
      ref={ref}
      className={`pr-flip ${v ? "on" : ""}`}
      style={{ animationDelay: v ? `${delay}ms` : undefined }}
    >
      <div
        ref={tilt}
        className="pr-card bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg relative group"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-orange-100 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none hidden sm:block"
          style={{ animation: "morphBlob 5s ease infinite" }}
        />
        <div className="relative h-48 sm:h-56 overflow-hidden bg-orange-50 dark:bg-gray-700">
          <img
            src={product.image}
            alt={product.name}
            className="img-zoom w-full h-full object-cover"
          />
          {product.quantity === 0 && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <span
                className="text-white font-black text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full"
                style={{
                  background: "rgba(239,68,68,.85)",
                  animation: "stockFade .4s ease both",
                }}
              >
                Out of Stock
              </span>
            </div>
          )}
          <div
            className="absolute top-3 left-3 px-2 sm:px-2.5 py-1 rounded-full text-white text-xs font-black"
            style={{
              background: "linear-gradient(135deg,#f97316,#ec4899)",
              animation: `badgePop .5s cubic-bezier(.22,.68,0,1.4) ${delay + 200}ms both`,
            }}
          >
            {product.tag || "Product"}
          </div>
        </div>
        <div className="p-4 sm:p-5" style={{ transform: "translateZ(10px)" }}>
          <h3
            className="text-sm sm:text-base font-black text-gray-900 dark:text-white mb-1.5 line-clamp-1"
            style={{ fontFamily: "Syne,sans-serif" }}
          >
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center mb-3 star-row">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="star-i w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="ml-1.5 text-xs text-gray-400">(50+)</span>
          </div>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <span className="text-lg sm:text-xl font-black ab-shimmer">
              ${parseFloat(product.unit_price).toFixed(2)}
            </span>
            <span className="text-xs text-gray-400">
              {product.quantity} in stock
            </span>
          </div>
          <button
            onClick={(e) => {
              if (product.quantity > 0) spawnParticles(e.clientX, e.clientY);
              onAdd(product);
            }}
            disabled={product.quantity === 0}
            className="add-btn w-full py-2.5 sm:py-3 text-white rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#f97316,#ec4899)" }}
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const Products: React.FC<ProductsProps> = ({ onNavigate }) => {
  useStyles();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [cat, setCat] = useState("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    setFiltered(
      cat === "all" ? products : products.filter((p) => p.tag === cat),
    );
  }, [cat, products]);

  // ✅ Fixed: signature matches updated ProductCard onAdd prop (no `e` param)
  const addCart = (product: Product) => {
    if (!getAccessToken()) {
      toast.error("Please log in to add items to your cart.", {
        icon: "🔒",
        duration: 4000,
      });
      onNavigate("auth");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.unit_price),
      image_url: product.image,
      category: product.tag,
      stock: product.quantity,
      is_featured: false,
      created_at: product.date_created,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const ticks = [
    "✦ OUR PRODUCTS",
    "✦ BABY SOAP",
    "✦ BABY LOTION",
    "✦ BODY WASH",
    "✦ NATURAL CARE",
    "✦ 100% ORGANIC",
  ];

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold px-4 text-center">
        Failed to load products: {error}
      </div>
    );

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
        className="pr-blob w-48 sm:w-80 h-48 sm:h-80 bg-orange-300 opacity-20 hidden sm:block"
        style={{
          position: "absolute",
          top: "-60px",
          left: "-60px",
          animationDuration: "9s",
        }}
      />
      <div
        className="pr-blob w-40 sm:w-60 h-40 sm:h-60 bg-pink-300 opacity-15 hidden sm:block"
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
          SHOP NOW
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-black mb-3 sm:mb-4"
          style={{
            fontFamily: "Syne,sans-serif",
            animation: ready
              ? "heroTitle 1s cubic-bezier(.22,.68,0,1.2) .1s both"
              : "none",
            opacity: ready ? undefined : 0,
          }}
        >
          Our <span className="ab-shimmer">Products</span>
        </h1>
        <p
          className={`text-base sm:text-xl text-gray-600 pr-reveal-up ${ready ? "on" : ""}`}
          style={{ transitionDelay: "350ms" }}
        >
          Premium baby care products for gentle, loving care
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
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div
          className={`flex items-center justify-center mb-6 sm:mb-10 gap-2 sm:gap-3 flex-wrap pr-reveal-up ${ready ? "on" : ""}`}
          style={{ transitionDelay: "400ms" }}
        >
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`cat-btn px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm ${cat === c.id ? "text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}
              style={
                cat === c.id
                  ? {
                      background: "linear-gradient(135deg,#f97316,#ec4899)",
                      boxShadow: "0 8px 24px rgba(249,115,22,.3)",
                    }
                  : {}
              }
            >
              {c.name}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-64 sm:h-80 bg-white rounded-3xl shadow-md relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-50/60 to-transparent"
                  style={{
                    animation: `shimmerSkel 1.5s ease ${i * 0.1}s infinite`,
                  }}
                />
                <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-300 dot-1" />
                  <div className="w-2 h-2 rounded-full bg-pink-300 dot-2" />
                  <div className="w-2 h-2 rounded-full bg-yellow-300 dot-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={addCart}
                  delay={i * 60}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <div
                className="text-center py-16 sm:py-20"
                style={{ animation: "fadeUp .6s ease both" }}
              >
                <Sparkles
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4"
                  style={{ color: "#f97316" }}
                />
                <p className="text-base sm:text-xl font-bold text-gray-500">
                  No products found in this category
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
