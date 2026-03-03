// src/pages/Home.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  Star,
  Shield,
  Award,
  Leaf,
  Sparkles,
  Quote,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../contexts/CartContext";
import { getAccessToken } from "../contexts/AuthContext";
import { useProducts } from "../hooks/useProducts";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

  :root {
    --peach: #f97316;
    --pink: #ec4899;
    --gold: #fbbf24;
    --lime: #84cc16;
  }

  * { box-sizing: border-box; }

  @keyframes heroTitle {
    0%   { opacity:0; transform: perspective(800px) rotateX(90deg) translateY(-60px); filter: blur(20px); }
    60%  { filter: blur(0); }
    100% { opacity:1; transform: perspective(800px) rotateX(0deg) translateY(0); }
  }
  @keyframes morphBlob {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    50%      { border-radius: 50% 60% 30% 40% / 70% 30% 50% 60%; }
    75%      { border-radius: 40% 30% 60% 70% / 30% 70% 40% 50%; }
  }
  @keyframes orbitRing {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes orbitRingReverse {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes floatY {
    0%,100% { transform: translateY(0) rotate(0deg); }
    33%      { transform: translateY(-18px) rotate(3deg); }
    66%      { transform: translateY(-8px) rotate(-2deg); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 20px rgba(249,115,22,0.4), 0 0 60px rgba(249,115,22,0.1); }
    50%      { box-shadow: 0 0 40px rgba(249,115,22,0.8), 0 0 100px rgba(249,115,22,0.3); }
  }
  @keyframes textGlitch {
    0%,90%,100% { transform: none; text-shadow: none; }
    91%  { transform: skewX(-15deg) translateX(-3px); text-shadow: 3px 0 #ec4899, -3px 0 #f97316; }
    93%  { transform: skewX(5deg)  translateX(2px);  text-shadow: -3px 0 #ec4899, 3px 0 #f97316; }
    95%  { transform: skewX(-3deg) translateX(-1px); text-shadow: 2px 0 #fbbf24; }
    97%  { transform: none; text-shadow: none; }
  }
  @keyframes rainbowShift {
    0%   { filter: hue-rotate(0deg)   saturate(1.2); }
    100% { filter: hue-rotate(360deg) saturate(1.2); }
  }
  @keyframes shimmerBg {
    0%   { background-position: -400% 0; }
    100% { background-position:  400% 0; }
  }
  @keyframes explode {
    0%   { transform: translate(0,0) scale(1); opacity:1; }
    100% { transform: translate(var(--ex), var(--ey)) scale(0); opacity:0; }
  }
  @keyframes morphCard {
    0%,100% { border-radius: 16px; }
    50%      { border-radius: 32px 8px 32px 8px; }
  }
  @keyframes cardFlip {
    0%   { transform: perspective(1000px) rotateY(-8deg) rotateX(4deg) scale(0.92); opacity: 0; }
    100% { transform: perspective(1000px) rotateY(0deg)  rotateX(0deg) scale(1);    opacity: 1; }
  }
  @keyframes badgePop {
    0%   { transform: scale(0) rotate(-20deg); opacity:0; }
    70%  { transform: scale(1.2) rotate(5deg); }
    85%  { transform: scale(0.95) rotate(-2deg); }
    100% { transform: scale(1) rotate(0); opacity:1; }
  }
  @keyframes waveText {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes trailFade {
    0%   { opacity: 0.8; transform: scale(1); }
    100% { opacity: 0;   transform: scale(0.2); }
  }
  @keyframes gradientRotate {
    0%   { background-position: 0%   50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0%   50%; }
  }
  @keyframes neonFlicker {
    0%,100%{ text-shadow: 0 0 10px #f97316, 0 0 20px #f97316, 0 0 40px #f97316; opacity:1; }
    50%    { text-shadow: 0 0 5px #f97316; opacity:0.85; }
    92%    { text-shadow: none; opacity:0.7; }
    94%    { text-shadow: 0 0 10px #f97316, 0 0 30px #f97316; opacity:1; }
  }
  @keyframes ctaOrb {
    0%   { transform: translate(0,0)        scale(1); }
    25%  { transform: translate(30px,-20px) scale(1.1); }
    50%  { transform: translate(60px,10px)  scale(0.9); }
    75%  { transform: translate(20px,30px)  scale(1.05); }
    100% { transform: translate(0,0)        scale(1); }
  }
  @keyframes iconDance {
    0%,100% { transform: rotate(0)    scale(1); }
    25%      { transform: rotate(15deg) scale(1.1); }
    50%      { transform: rotate(-5deg) scale(0.95); }
    75%      { transform: rotate(10deg) scale(1.05); }
  }
  @keyframes borderDance {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  @keyframes screenFlash {
    0%,100% { opacity: 0; }
    50%      { opacity: 0.03; }
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .preferable-page { font-family: 'Plus Jakarta Sans', sans-serif; cursor: none; }

  .cursor-dot {
    width: 12px; height: 12px; background: var(--peach); border-radius: 50%;
    position: fixed; pointer-events: none; z-index: 9999;
    transform: translate(-50%,-50%);
    transition: transform 0.1s ease, width 0.2s ease, height 0.2s ease;
    mix-blend-mode: multiply;
  }
  .cursor-ring {
    width: 36px; height: 36px; border: 2px solid var(--peach); border-radius: 50%;
    position: fixed; pointer-events: none; z-index: 9998;
    transform: translate(-50%,-50%);
    transition: transform 0.15s ease, width 0.25s ease, height 0.25s ease;
    opacity: 0.7;
  }
  .cursor-trail {
    width: 8px; height: 8px; border-radius: 50%; position: fixed;
    pointer-events: none; z-index: 9997; transform: translate(-50%,-50%);
    animation: trailFade 0.5s ease forwards;
  }

  /* Hide custom cursor on touch devices */
  @media (hover: none) {
    .cursor-dot, .cursor-ring, .cursor-trail { display: none !important; }
    .preferable-page { cursor: auto; }
  }

  .magnetic { transition: transform 0.3s cubic-bezier(.22,.68,0,1.4), box-shadow 0.3s ease; display: inline-flex; align-items: center; justify-content: center; }
  .tilt-card { transform-style: preserve-3d; transition: transform 0.1s ease; will-change: transform; }
  .blob { position: absolute; border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; animation: morphBlob 8s ease-in-out infinite; filter: blur(1px); opacity: 0.15; }
  .hero-title { font-family: 'Syne', sans-serif; animation: heroTitle 1s cubic-bezier(.22,.68,0,1.2) 0.1s both; }
  .glitch { animation: textGlitch 6s ease infinite; }
  .rainbow { animation: rainbowShift 4s linear infinite; }
  .shimmer-extreme {
    background: linear-gradient(90deg, var(--peach) 0%, var(--gold) 20%, var(--pink) 40%, var(--lime) 60%, var(--peach) 80%, var(--gold) 100%);
    background-size: 400% auto;
    // -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    // animation: shimmerBg 3s linear infinite;
  }
  .reveal-flip      { opacity:0; transform: perspective(1000px) rotateY(-8deg) rotateX(4deg) scale(0.92); transition: none; }
  .reveal-flip.on   { animation: cardFlip 0.7s cubic-bezier(.22,.68,0,1.2) both; }
  .reveal-up        { opacity:0; transform: translateY(40px); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(.22,.68,0,1.2); }
  .reveal-up.on     { opacity:1; transform: translateY(0); }
  .neon-glow { animation: neonFlicker 3s ease-in-out infinite; }
  .grad-anim { background: linear-gradient(-45deg, #fee2e2, #fef3c7, #fce7f3, #fff7ed); background-size: 400% 400%; animation: gradientRotate 8s ease infinite; }
  .wave-char { display: inline-block; }
  .particle { position: absolute; pointer-events: none; border-radius: 50%; animation: explode 0.8s ease-out forwards; }
  .wave-sep { width:100%; overflow:hidden; line-height:0; }
  .wave-sep svg { display:block; }
  .cta-orb { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%); animation: ctaOrb var(--dur, 6s) ease-in-out infinite; pointer-events: none; }
  .ticker-track { animation: ticker 20s linear infinite; display: flex; width: max-content; }
  .ticker-wrap  { overflow: hidden; }
  .badge-pop { animation: badgePop 0.6s cubic-bezier(.22,.68,0,1.4) both; }
  .screen-flash { position: fixed; inset: 0; pointer-events:none; z-index: 9000; background: radial-gradient(circle at 50% 50%, rgba(249,115,22,0.15) 0%, transparent 70%); animation: screenFlash 8s ease infinite; }
  .group:hover .icon-dance { animation: iconDance 0.6s ease both; }
`;

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

function useStyles() {
  useEffect(() => {
    if (document.getElementById("pref-extreme-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-extreme-styles";
    s.textContent = STYLES;
    document.head.appendChild(s);
  }, []);
}

function useCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const colors = ["#f97316", "#ec4899", "#fbbf24", "#84cc16", "#06b6d4"];
    let colorIdx = 0;

    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      mouseRef.current = { x, y };
      if (dotRef.current) {
        dotRef.current.style.left = x + "px";
        dotRef.current.style.top = y + "px";
      }
      const trail = document.createElement("div");
      trail.className = "cursor-trail";
      trail.style.cssText = `left:${x}px;top:${y}px;background:${colors[colorIdx++ % colors.length]};width:${4 + Math.random() * 6}px;height:${4 + Math.random() * 6}px;`;
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 500);
    };

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, mouseRef.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, mouseRef.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + "px";
        ringRef.current.style.top = ringPos.current.y + "px";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onEnter = () => {
      if (dotRef.current) {
        dotRef.current.style.width = "24px";
        dotRef.current.style.height = "24px";
      }
      if (ringRef.current) {
        ringRef.current.style.width = "60px";
        ringRef.current.style.height = "60px";
      }
    };
    const onLeave = () => {
      if (dotRef.current) {
        dotRef.current.style.width = "12px";
        dotRef.current.style.height = "12px";
      }
      if (ringRef.current) {
        ringRef.current.style.width = "36px";
        ringRef.current.style.height = "36px";
      }
    };
    document.querySelectorAll("button, a").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return { dotRef, ringRef };
}

function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) scale(1.04)`;
    };
    const onLeave = () => {
      el.style.transform = "perspective(1000px) rotateY(0) rotateX(0) scale(1)";
      el.style.transition = "transform 0.5s ease";
    };
    const onEnter = () => {
      el.style.transition = "transform 0.1s ease";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseenter", onEnter);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mouseenter", onEnter);
    };
  }, [strength]);
  return ref;
}

function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz0123456789";
  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const total = 20;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (frame / total > i / text.length) return ch;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );
      frame++;
      if (frame > total) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [trigger, text]);
  return display;
}

function spawnParticles(x: number, y: number, count = 16) {
  const colors = [
    "#f97316",
    "#ec4899",
    "#fbbf24",
    "#84cc16",
    "#06b6d4",
    "#a855f7",
  ];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    const angle = (i / count) * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    const size = 6 + Math.random() * 10;
    p.className = "particle";
    p.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};--ex:${tx}px;--ey:${ty}px;animation-duration:${0.6 + Math.random() * 0.4}s;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
}

const MagBtn: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, onClick, className = "", style }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.35;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    el.style.transform = `translate(${x}px, ${y}px) scale(1.06)`;
  };
  const handleLeave = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0,0) scale(1)";
    el.style.transition = "transform 0.4s cubic-bezier(.22,.68,0,1.4)";
    spawnParticles(e.clientX, e.clientY, 8);
  };
  const handleEnter = () => {
    if (ref.current) ref.current.style.transition = "transform 0.1s ease";
  };
  const handleClick = (e: React.MouseEvent) => {
    spawnParticles(e.clientX, e.clientY, 20);
    onClick?.();
  };
  return (
    <button
      ref={ref}
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      className={`magnetic ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

const WaveText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = "",
}) => (
  <span className={className}>
    {text.split("").map((ch, i) => (
      <span
        key={i}
        className="wave-char"
        style={{
          animationDelay: `${i * 80}ms`,
          display: "inline-block",
          animation: `waveText 1.5s ease-in-out ${i * 80}ms infinite`,
        }}
      >
        {ch === " " ? "\u00A0" : ch}
      </span>
    ))}
  </span>
);

const Reveal: React.FC<{
  children: React.ReactNode;
  type?: "flip" | "up";
  delay?: number;
  className?: string;
}> = ({ children, type = "up", delay = 0, className = "" }) => {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`${type === "flip" ? "reveal-flip" : "reveal-up"} ${visible ? "on" : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        animationDelay: visible ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
};

type HomeProps = { onNavigate: (page: string) => void };

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  useStyles();
  const { dotRef, ringRef } = useCursor();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 3);

  const [heroReady, setHeroReady] = useState(false);
  const [badgePop, setBadgePop] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroReady(true), 80);
    setTimeout(() => setBadgePop(true), 1200);
  }, []);

  const heroScramble = useScramble(
    "Natural Care for Your Little Ones",
    heroReady,
  );
  const tiltRef1 = useTilt(10);
  const tiltRef2 = useTilt(8);
  const tiltRef3 = useTilt(8);
  const tiltRefs = [tiltRef1, tiltRef2, tiltRef3];

  const handleAddToCart = async (
    product: ReturnType<typeof useProducts>["products"][number],
    e?: React.MouseEvent,
  ) => {
    if (e) spawnParticles(e.clientX, e.clientY, 24);
    if (!getAccessToken()) {
      toast.error("Please log in to add items to your cart.", {
        icon: "🔒",
        duration: 4000,
      });
      onNavigate("login");
      return;
    }
    try {
      await addToCart({
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
      toast.success(`✨ ${product.name} blasted into your cart!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("401") || msg.includes("403")) {
        toast.error("Session expired. Please log in again.", {
          icon: "🔒",
          duration: 4000,
        });
        onNavigate("login");
      } else toast.error("Failed to add to cart. Please try again.");
    }
  };

  const tickerItems = [
    "✦ 100% ORGANIC",
    "✦ PARABEN FREE",
    "✦ DERMATOLOGIST TESTED",
    "✦ KIDS & TEENS",
    "✦ NATURAL INGREDIENTS",
    "✦ MOISTURIZING",
    "✦ SAFE FOR ALL SKIN TYPES",
  ];

  return (
    <div className="preferable-page min-h-screen relative overflow-x-hidden">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <div className="screen-flash" />

      {/* ── HERO ── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden grad-anim pt-20 dark:bg-none dark:bg-gray-900"
      >
        {/* Blobs — reduced on mobile */}
        <div
          className="blob hidden sm:block"
          style={{
            width: "24rem",
            height: "24rem",
            background: "#fb923c",
            top: "-80px",
            left: "-60px",
            animationDuration: "9s",
          }}
        />
        <div
          className="blob hidden sm:block"
          style={{
            width: "18rem",
            height: "18rem",
            background: "#f472b6",
            bottom: "-40px",
            right: "-30px",
            animationDuration: "11s",
            animationDelay: "3s",
          }}
        />
        <div
          className="blob"
          style={{
            width: "12rem",
            height: "12rem",
            background: "#fbbf24",
            top: "33%",
            left: "33%",
            animationDuration: "7s",
            animationDelay: "1s",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 md:pt-8 w-full">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Copy */}
            <div className="space-y-5 sm:space-y-6 text-center md:text-left">
              <div
                className={`inline-block px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-bold transition-all duration-700 ${heroReady ? "badge-pop opacity-100" : "opacity-0"}`}
                style={{
                  background:
                    "linear-gradient(135deg, #f97316, #ec4899, #fbbf24)",
                  color: "white",
                }}
              >
                <WaveText text="✦ 100% ORGANIC ACTIVE ✦" />
              </div>

              <h1
                className="hero-title text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] text-gray-900 dark:text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                <span className="block shimmer-extreme">
                  {heroReady
                    ? heroScramble.split(" ").slice(0, 2).join(" ")
                    : "Natural Care"}
                </span>
                <span className="block text-gray-900 dark:text-white mt-1 glitch">
                  for Your Little Ones
                </span>
              </h1>

              <p
                className={`text-base sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed reveal-up ${heroReady ? "on" : ""}`}
                style={{ transitionDelay: "400ms" }}
              >
                PREFERABLE Kids &amp; Teens Natural &amp; Moisturizing Body Milk
                — proven to nourish like royalty with organic active ingredients
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-3 sm:gap-4 reveal-up justify-center md:justify-start ${heroReady ? "on" : ""}`}
                style={{ transitionDelay: "550ms" }}
              >
                <MagBtn
                  onClick={() => onNavigate("products")}
                  className="group px-6 sm:px-8 py-3 sm:py-4 text-white rounded-full font-bold text-base sm:text-lg shadow-2xl flex items-center justify-center gap-2 w-full sm:w-auto"
                  style={
                    {
                      background:
                        "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #f97316 100%)",
                      backgroundSize: "200% auto",
                      animation: "shimmerBg 3s linear infinite",
                    } as React.CSSProperties
                  }
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </MagBtn>
                <MagBtn
                  onClick={() => onNavigate("about")}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 rounded-full font-bold text-base sm:text-lg border-2 hover:border-pink-400 transition-colors duration-300 w-full sm:w-auto"
                  style={{ color: "var(--peach)" }}
                >
                  Learn More
                </MagBtn>
              </div>

              <div
                className={`flex items-center justify-center md:justify-start flex-wrap gap-4 sm:gap-6 pt-2 reveal-up ${heroReady ? "on" : ""}`}
                style={{ transitionDelay: "700ms" }}
              >
                {[
                  { Icon: Shield, label: "Paraben Free", color: "#f97316" },
                  { Icon: Leaf, label: "100% Organic", color: "#84cc16" },
                  {
                    Icon: Award,
                    label: "Dermatologist Tested",
                    color: "#ec4899",
                  },
                ].map(({ Icon, label, color }) => (
                  <div
                    key={label}
                    className="group flex items-center gap-2 cursor-default select-none"
                  >
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${color}22`,
                        transition: "transform 0.3s ease, background 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background =
                          `${color}44`;
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "rotate(15deg) scale(1.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background =
                          `${color}22`;
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "rotate(0) scale(1)";
                      }}
                    >
                      <Icon
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        style={{ color }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div
              className={`relative reveal-up mt-8 md:mt-0 ${heroReady ? "on" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="absolute w-[110%] h-[110%] rounded-full border-2 border-dashed border-orange-300/50 dark:border-orange-700/50"
                  style={{ animation: "orbitRing 12s linear infinite" }}
                />
                <div
                  className="absolute w-[125%] h-[125%] rounded-full border border-dotted border-pink-300/40 dark:border-pink-700/40"
                  style={{ animation: "orbitRingReverse 18s linear infinite" }}
                />
                <div
                  className="absolute w-[90%] h-[90%] rounded-full border-2 border-yellow-300/30"
                  style={{ animation: "orbitRing 8s linear infinite" }}
                />
              </div>
              <div
                className="absolute inset-8 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ec4899)",
                  animation: "pulseGlow 3s ease-in-out infinite",
                  filter: "blur(24px)",
                  opacity: 0.4,
                }}
              />
              <div
                className="relative z-10 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-3xl shadow-2xl mx-auto max-w-xs sm:max-w-sm md:max-w-none"
                style={{ animation: "floatY 5s ease-in-out infinite" }}
              >
                <img
                  src="/images/newLogo.png"
                  alt="Preferable Products"
                  className="w-full h-auto rounded-2xl rainbow"
                />
              </div>

              {badgePop && (
                <div className="absolute -bottom-4 sm:-bottom-6 -right-2 sm:-right-6 z-20 bg-white dark:bg-gray-700 p-3 sm:p-4 rounded-2xl shadow-2xl badge-pop">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {["#f97316", "#ec4899", "#fbbf24"].map((c, i) => (
                        <div
                          key={i}
                          className="relative w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-white dark:border-gray-800 flex-shrink-0"
                          style={{
                            background: c,
                            animation: `floatY ${3 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                    <div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400"
                            style={{
                              animation: `waveText 1s ease ${i * 100}ms infinite`,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        1000+ Happy Parents
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div
        className="ticker-wrap py-2.5 sm:py-3 overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #f97316, #ec4899)",
          borderTop: "2px solid #fbbf24",
          borderBottom: "2px solid #fbbf24",
        }}
      >
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              className="text-white font-black text-xs sm:text-sm tracking-widest px-5 sm:px-8 flex-shrink-0"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section
        id="products"
        className="py-16 sm:py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #fff7ed 0%, #fce7f3 50%, #fef9c3 100%)",
        }}
      >
        <div
          className="blob hidden sm:block"
          style={{
            width: "16rem",
            height: "16rem",
            background: "#fb923c",
            top: 0,
            right: 0,
            opacity: 0.2,
            animationDuration: "10s",
          }}
        />
        <div
          className="blob hidden sm:block"
          style={{
            width: "12rem",
            height: "12rem",
            background: "#f472b6",
            bottom: "2.5rem",
            left: "2.5rem",
            opacity: 0.15,
            animationDuration: "13s",
            animationDelay: "2s",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-10 sm:mb-16">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              <span className="shimmer-extreme">Featured Products</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 font-medium">
              Our most loved products for your baby's care
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-72 sm:h-80 rounded-3xl overflow-hidden relative bg-gray-200 dark:bg-gray-700"
                    style={{
                      animation: `morphCard 4s ease ${i * 0.5}s infinite`,
                    }}
                  >
                    <div className="flex items-center justify-center h-full gap-2">
                      {[0, 1, 2].map((j) => (
                        <div
                          key={j}
                          className="w-3 h-3 rounded-full bg-orange-400"
                          style={{
                            animation: `waveText 0.8s ease ${j * 120}ms infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))
              : featuredProducts.map((product, index) => (
                  <Reveal key={product.id} type="flip" delay={index * 150}>
                    <div
                      ref={tiltRefs[index]}
                      className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="relative h-52 sm:h-64 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          style={{ filter: "saturate(1.1)" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div
                          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-black badge-pop"
                          style={{
                            background:
                              "linear-gradient(135deg, #f97316, #ec4899)",
                            animationDelay: `${index * 150 + 300}ms`,
                          }}
                        >
                          ✦ Featured
                        </div>
                      </div>

                      <div
                        className="p-4 sm:p-6"
                        style={{ transform: "translateZ(20px)" }}
                      >
                        <h3
                          className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2"
                          style={{ fontFamily: "'Syne',sans-serif" }}
                        >
                          {product.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span
                            className="text-xl sm:text-2xl font-black"
                            style={{
                              fontFamily: "'Syne',sans-serif",
                              background:
                                "linear-gradient(135deg, #f97316, #ec4899)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            ${parseFloat(product.unit_price).toFixed(2)}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                                style={{
                                  animation: `waveText 1.2s ease ${i * 100}ms infinite`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <MagBtn
                            onClick={() => onNavigate("products")}
                            className="flex-1 py-2.5 sm:py-3 border-2 border-orange-400 text-orange-500 rounded-full font-bold text-xs sm:text-sm hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            View Details
                          </MagBtn>
                          <MagBtn
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 py-2.5 sm:py-3 text-white rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 shadow-lg"
                            style={{
                              background:
                                "linear-gradient(135deg, #f97316, #ec4899)",
                            }}
                          >
                            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 icon-dance" />
                            Add to Cart
                          </MagBtn>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* Wave separator */}
      <div className="wave-sep -mt-1" style={{ background: "white" }}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
            fill="url(#waveGrad)"
          />
          <defs>
            <linearGradient
              id="waveGrad"
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="50%" stopColor="#fce7f3" />
              <stop offset="100%" stopColor="#fef9c3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── BENEFITS ── */}
      <section
        id="benefits"
        className="py-16 sm:py-24 bg-white dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-10 sm:mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-6xl font-black mb-3 sm:mb-4 text-gray-900 dark:text-white"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              Why Choose <span className="shimmer-extreme">PREFERABLE?</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-500 dark:text-gray-400">
              Trusted by thousands of parents worldwide
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Heart,
                title: "Made with Love",
                desc: "Every product is crafted with care and the finest natural ingredients",
                color: "#f97316",
              },
              {
                icon: Shield,
                title: "Dermatologist Tested",
                desc: "Clinically proven safe for sensitive baby skin and hypoallergenic",
                color: "#ec4899",
              },
              {
                icon: Sparkles,
                title: "Natural Ingredients",
                desc: "Free from harsh chemicals, parabens, and artificial fragrances",
                color: "#fbbf24",
              },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 140}>
                <div
                  className="group relative p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden h-full"
                  style={{
                    transition:
                      "transform 0.4s cubic-bezier(.22,.68,0,1.2), box-shadow 0.4s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-12px) scale(1.02)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      `0 32px 64px ${f.color}33`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                  }}
                >
                  <div
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{
                      background: f.color,
                      animation: "borderDance 4s ease infinite",
                    }}
                  />
                  <div
                    className="icon-dance w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 relative z-10"
                    style={{ background: `${f.color}22` }}
                  >
                    <f.icon
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      style={{ color: f.color }}
                    />
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2 relative z-10"
                    style={{ fontFamily: "'Syne',sans-serif" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 relative z-10">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        className="py-16 sm:py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #fff7ed, #fce7f3)" }}
      >
        <div
          className="blob hidden sm:block"
          style={{
            width: "20rem",
            height: "20rem",
            background: "#f9a8d4",
            top: 0,
            left: 0,
            opacity: 0.2,
            animationDuration: "9s",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-10 sm:mb-16">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 text-gray-900"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              <span className="shimmer-extreme">What Parents Say</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600">
              Real experiences from families who love PREFERABLE
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, idx) => (
              <Reveal key={idx} type="flip" delay={idx * 160}>
                <div
                  className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden relative h-full"
                  style={{
                    transition:
                      "transform 0.4s cubic-bezier(.22,.68,0,1.2), box-shadow 0.4s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-10px) rotate(1deg)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 32px 64px rgba(249,115,22,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full -mr-8 -mt-8 opacity-10"
                    style={{
                      background: ["#f97316", "#ec4899", "#fbbf24"][idx],
                      animation: `morphBlob ${7 + idx}s ease infinite`,
                    }}
                  />
                  <Quote
                    className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4"
                    style={{
                      color: ["#f97316", "#ec4899", "#fbbf24"][idx],
                      animation: `floatY ${3 + idx * 0.3}s ease-in-out infinite`,
                    }}
                  />
                  <div className="flex mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                        style={{
                          animation: `waveText 1.2s ease ${i * 80}ms infinite`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                    "Sample testimonial text for parent {idx + 1}."
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${["#f97316", "#ec4899", "#fbbf24"][idx]}, ${["#ec4899", "#fbbf24", "#84cc16"][idx]})`,
                        animation: `floatY ${3.5 + idx * 0.4}s ease-in-out ${idx * 0.3}s infinite`,
                      }}
                    />
                    <div>
                      <p
                        className="font-black text-gray-900 text-sm sm:text-base"
                        style={{ fontFamily: "'Syne',sans-serif" }}
                      >
                        Parent {idx + 1}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Mother/Father of {idx + 1}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="relative py-16 sm:py-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #f97316 100%)",
          backgroundSize: "200% auto",
          animation: "shimmerBg 5s linear infinite",
        }}
      >
        {[
          { size: 200, top: "5%", left: "5%", dur: "7s", delay: "0s" },
          { size: 120, top: "70%", left: "80%", dur: "9s", delay: "1s" },
          { size: 80, top: "30%", left: "60%", dur: "5s", delay: "2s" },
          { size: 160, top: "80%", left: "20%", dur: "8s", delay: "0.5s" },
          { size: 50, top: "50%", left: "90%", dur: "4s", delay: "3s" },
        ].map((o, i) => (
          <div
            key={i}
            className="cta-orb hidden sm:block"
            style={
              {
                width: o.size,
                height: o.size,
                top: o.top,
                left: o.left,
                "--dur": o.dur,
                animationDelay: o.delay,
              } as React.CSSProperties
            }
          />
        ))}

        <Reveal className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6"
            style={{
              fontFamily: "'Syne',sans-serif",
              textShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
          >
            <WaveText text="Give Your Child The Best" />
            <br />
            <span
              style={{
                animation: "neonFlicker 2s ease infinite",
                textShadow: "0 0 20px rgba(255,255,255,0.5)",
              }}
            >
              Natural Care
            </span>
          </h2>
          <p className="text-base sm:text-xl text-white/90 mb-8 sm:mb-10">
            Join thousands of happy parents who trust PREFERABLE for their
            children's skincare
          </p>
          <MagBtn
            onClick={() => onNavigate("products")}
            className="px-8 sm:px-12 py-4 sm:py-5 bg-white text-orange-600 rounded-full text-lg sm:text-xl font-black shadow-2xl hover:shadow-orange-500/30 transition-shadow w-full sm:w-auto"
          >
            ✦ Order Now ✦
          </MagBtn>
        </Reveal>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal type="flip">
            <div
              className="rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #fff7ed, #fce7f3, #fef9c3)",
              }}
            >
              <div
                className="blob hidden sm:block"
                style={{
                  width: "16rem",
                  height: "16rem",
                  background: "#fb923c",
                  opacity: 0.1,
                  top: 0,
                  left: 0,
                  animationDuration: "8s",
                }}
              />
              <div
                className="blob hidden sm:block"
                style={{
                  width: "12rem",
                  height: "12rem",
                  background: "#f472b6",
                  opacity: 0.1,
                  bottom: 0,
                  right: 0,
                  animationDuration: "10s",
                  animationDelay: "2s",
                }}
              />

              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-gray-900 relative z-10"
                style={{ fontFamily: "'Syne',sans-serif" }}
              >
                <span className="shimmer-extreme">Reach Out to Us</span>
              </h2>
              <p className="text-base sm:text-xl mb-6 sm:mb-10 text-gray-700 relative z-10">
                Have questions? Message us directly on WhatsApp!
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const nameInput = (
                    e.currentTarget.elements.namedItem(
                      "name",
                    ) as HTMLInputElement
                  ).value;
                  const emailInput = (
                    e.currentTarget.elements.namedItem(
                      "email",
                    ) as HTMLInputElement
                  ).value;
                  const messageInput = (
                    e.currentTarget.elements.namedItem(
                      "message",
                    ) as HTMLTextAreaElement
                  ).value;
                  const msg = `Hello Preferable Team! 👋\n\nMy name is ${nameInput}.\nEmail: ${emailInput}\nMessage: ${messageInput}\n\nLooking forward to your response. Thank you!`;
                  window.open(
                    `https://wa.me/2348142401236?text=${encodeURIComponent(msg)}`,
                    "_blank",
                  );
                }}
                className="max-w-md mx-auto flex flex-col gap-3 sm:gap-4 relative z-10 w-full"
              >
                {(["name", "email", "message"] as const).map((name, i) => {
                  const base =
                    "px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white text-gray-900 w-full outline-none border-2 border-transparent font-medium text-sm sm:text-base";
                  const focusStyle =
                    "focus:border-orange-400 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.15)] focus:scale-[1.02]";
                  const transStyle = "transition-all duration-300";
                  return name === "message" ? (
                    <textarea
                      key={name}
                      name={name}
                      placeholder="Your Message ✦"
                      required
                      rows={4}
                      className={`${base} ${focusStyle} ${transStyle} resize-none`}
                      style={{
                        animation: `cardFlip 0.6s ease ${i * 100}ms both`,
                      }}
                    />
                  ) : (
                    <input
                      key={name}
                      type={name === "email" ? "email" : "text"}
                      name={name}
                      placeholder={
                        name === "name" ? "Your Name ✦" : "Your Email ✦"
                      }
                      required
                      className={`${base} ${focusStyle} ${transStyle}`}
                      style={{
                        animation: `cardFlip 0.6s ease ${i * 100}ms both`,
                      }}
                    />
                  );
                })}
                <MagBtn
                  className="px-6 sm:px-8 py-3 sm:py-4 text-white rounded-full font-black text-base sm:text-lg shadow-xl w-full"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ec4899)",
                  }}
                >
                  ✦ Message Us on WhatsApp ✦
                </MagBtn>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
