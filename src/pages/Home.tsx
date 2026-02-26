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

// ── Animation helpers ────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ── CSS injected once ────────────────────────────────────────────────────────

const ANIMATION_STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-48px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(48px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes floatBadge {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50%       { transform: translateY(-8px) rotate(2deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes shimmerSkeleton {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes bounce-dot {
    0%, 100% { transform: translateY(0);    opacity: 0.5; }
    50%       { transform: translateY(-8px); opacity: 1; }
  }

  .anim-fade-up    { animation: fadeUp       0.65s ease both; }
  .anim-fade-in    { animation: fadeIn       0.55s ease both; }
  .anim-slide-left { animation: slideInLeft  0.65s ease both; }
  .anim-slide-right{ animation: slideInRight 0.65s ease both; }
  .anim-scale-in   { animation: scaleIn      0.6s  cubic-bezier(.22,.68,0,1.2) both; }
  .anim-float      { animation: float        4s    ease-in-out infinite; }
  .anim-float-badge{ animation: floatBadge   3.5s  ease-in-out infinite; }
  .anim-spin-slow  { animation: spin-slow    14s   linear infinite; }

  .delay-100  { animation-delay: 100ms; }
  .delay-200  { animation-delay: 200ms; }
  .delay-300  { animation-delay: 300ms; }
  .delay-400  { animation-delay: 400ms; }
  .delay-500  { animation-delay: 500ms; }
  .delay-600  { animation-delay: 600ms; }
  .delay-700  { animation-delay: 700ms; }
  .delay-800  { animation-delay: 800ms; }

  /* Hover lift */
  .card-hover {
    transition: transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease;
  }
  .card-hover:hover {
    transform: translateY(-8px) scale(1.015);
    box-shadow: 0 24px 48px rgba(0,0,0,0.12);
  }

  /* Button press */
  .btn-press { transition: transform 0.15s ease, box-shadow 0.15s ease; }
  .btn-press:active { transform: scale(0.96) !important; }

  /* Shimmer badge text */
  .shimmer-text {
    background: linear-gradient(90deg, #f97316 0%, #fbbf24 40%, #ec4899 60%, #f97316 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  /* Pulse ring on first avatar */
  .pulse-ring::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 2px solid rgba(251,146,60,0.7);
    animation: pulse-ring 1.8s ease-out infinite;
  }

  /* Scroll-reveal states */
  .reveal       { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
  .reveal.on    { opacity: 1; transform: translateY(0); }
  .reveal-scale { opacity: 0; transform: scale(0.9);    transition: opacity 0.55s ease, transform 0.55s cubic-bezier(.22,.68,0,1.2); }
  .reveal-scale.on { opacity: 1; transform: scale(1); }

  /* Image zoom on card hover */
  .img-zoom { transition: transform 0.6s cubic-bezier(.22,.68,0,1.2); }
  .group:hover .img-zoom { transform: scale(1.08); }

  /* Icon bounce on card hover */
  .icon-box { transition: transform 0.3s cubic-bezier(.22,.68,0,1.2); }
  .group:hover .icon-box { transform: scale(1.15) rotate(4deg); }

  /* Star row twinkle */
  .star-row:hover .star-icon:nth-child(1) { animation: scaleIn 0.2s 0ms   both; }
  .star-row:hover .star-icon:nth-child(2) { animation: scaleIn 0.2s 50ms  both; }
  .star-row:hover .star-icon:nth-child(3) { animation: scaleIn 0.2s 100ms both; }
  .star-row:hover .star-icon:nth-child(4) { animation: scaleIn 0.2s 150ms both; }
  .star-row:hover .star-icon:nth-child(5) { animation: scaleIn 0.2s 200ms both; }

  /* Loading dots */
  .dot-1 { animation: bounce-dot 0.9s ease-in-out 0s   infinite; }
  .dot-2 { animation: bounce-dot 0.9s ease-in-out 0.15s infinite; }
  .dot-3 { animation: bounce-dot 0.9s ease-in-out 0.3s  infinite; }

  /* Shine sweep on buttons */
  .shine-sweep { overflow: hidden; position: relative; }
  .shine-sweep::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  .shine-sweep:hover::after { transform: translateX(100%); }

  /* Focus ring for form fields */
  .field-focus {
    transition: box-shadow 0.25s ease, transform 0.25s ease;
  }
  .field-focus:focus {
    box-shadow: 0 0 0 4px rgba(251,146,60,0.25);
    transform: scale(1.01);
  }
`;

function useAnimationStyles() {
  useEffect(() => {
    if (document.getElementById("preferable-anim")) return;
    const tag = document.createElement("style");
    tag.id = "preferable-anim";
    tag.textContent = ANIMATION_STYLES;
    document.head.appendChild(tag);
  }, []);
}

// ── Animated section wrapper ─────────────────────────────────────────────────

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  type?: "reveal" | "reveal-scale";
  delay?: number;
}

const Anim: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  type = "reveal",
  delay = 0,
}) => {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`${type} ${visible ? "on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ── Component ────────────────────────────────────────────────────────────────

type HomeProps = { onNavigate: (page: string) => void };

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  useAnimationStyles();

  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 3);

  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleAddToCart = async (
    product: ReturnType<typeof useProducts>["products"][number],
  ) => {
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
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("401") || message.includes("403")) {
        toast.error("Your session has expired. Please log in again.", {
          icon: "🔒",
          duration: 4000,
        });
        onNavigate("login");
      } else {
        toast.error("Failed to add to cart. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className="space-y-6">
            <div
              className="inline-block bg-orange-100 dark:bg-orange-800 px-4 py-2 rounded-full text-sm font-semibold anim-fade-up"
              style={{ animationPlayState: heroReady ? "running" : "paused" }}
            >
              <span className="shimmer-text">100% Organic Active</span>
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight anim-slide-left delay-200"
              style={{ animationPlayState: heroReady ? "running" : "paused" }}
            >
              Natural Care for Your Little Ones
            </h1>

            <p
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed anim-fade-up delay-300"
              style={{ animationPlayState: heroReady ? "running" : "paused" }}
            >
              PREFERABLE Kids &amp; Teens Natural &amp; Moisturizing Body Milk —
              proven to nourish like a prince and princess with organic active
              ingredients
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center anim-fade-up delay-500"
              style={{ animationPlayState: heroReady ? "running" : "paused" }}
            >
              <button
                onClick={() => onNavigate("products")}
                className="group btn-press shine-sweep px-8 py-4 bg-gradient-to-r from-peach-500 to-peach-600 dark:from-orange-600 dark:to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => onNavigate("about")}
                className="btn-press shine-sweep px-8 py-4 bg-white dark:bg-gray-800 text-peach-600 dark:text-peach-400 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-peach-500 dark:border-peach-400"
              >
                Learn More
              </button>
            </div>

            <div
              className="flex items-center space-x-8 pt-4 anim-fade-up delay-700"
              style={{ animationPlayState: heroReady ? "running" : "paused" }}
            >
              {[
                {
                  Icon: Shield,
                  color: "text-orange-500 dark:text-orange-400",
                  label: "Paraben Free",
                },
                {
                  Icon: Leaf,
                  color: "text-green-500 dark:text-green-400",
                  label: "100% Organic",
                },
                {
                  Icon: Award,
                  color: "text-pink-500 dark:text-pink-400",
                  label: "Dermatologist Tested",
                },
              ].map(({ Icon, color, label }) => (
                <div
                  key={label}
                  className="flex items-center space-x-2 group cursor-default"
                >
                  <Icon
                    className={`w-6 h-6 ${color} group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300`}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div
            className="relative anim-slide-right delay-200"
            style={{ animationPlayState: heroReady ? "running" : "paused" }}
          >
            {/* Spinning dashed ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[108%] h-[108%] rounded-full border-2 border-dashed border-orange-200 dark:border-orange-800 opacity-50 anim-spin-slow" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-pink-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl transform rotate-3 hover:rotate-1 transition-transform duration-500" />
            <div className="relative bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-2xl anim-float">
              <img
                src="/images/newLogo.png"
                alt="Preferable Kids & Teens Body Milk Products"
                className="w-full h-auto rounded-2xl"
              />
            </div>

            {/* Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-xl anim-float-badge">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[
                    "bg-orange-400 dark:bg-orange-600",
                    "bg-pink-400 dark:bg-pink-600",
                    "bg-orange-300 dark:bg-orange-500",
                  ].map((cls, i) => (
                    <div
                      key={i}
                      className={`relative w-8 h-8 ${cls} rounded-full border-2 border-white dark:border-gray-800 ${i === 0 ? "pulse-ring" : ""}`}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center star-row">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="star-icon w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                    1000+ Happy Parents
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────────── */}
      <section
        id="products"
        className="py-20 bg-gradient-to-br from-peach-50 to-peach-100 dark:from-gray-800 dark:to-gray-700 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Anim className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our most loved products for your baby's care
            </p>
          </Anim>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden relative"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{
                        animation: `shimmerSkeleton 1.6s ease ${i * 0.2}s infinite`,
                      }}
                    />
                    <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 dot-1" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 dot-2" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 dot-3" />
                    </div>
                  </div>
                ))
              : featuredProducts.map((product, index) => (
                  <Anim
                    key={product.id}
                    type="reveal-scale"
                    delay={index * 120}
                  >
                    <div className="group card-hover bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md">
                      <div className="relative h-64 overflow-hidden bg-peach-100 dark:bg-gray-700">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="img-zoom w-full h-full object-cover"
                        />
                        <div
                          className="absolute top-4 right-4 bg-peach-500 dark:bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold anim-scale-in"
                          style={{ animationDelay: `${index * 120 + 350}ms` }}
                        >
                          Featured
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-peach-600 dark:text-pink-400">
                            ${parseFloat(product.unit_price).toFixed(2)}
                          </span>
                          <div className="flex items-center space-x-1 star-row">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="star-icon w-4 h-4 fill-peach-400 dark:fill-pink-400 text-peach-400 dark:text-pink-400"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => onNavigate("products")}
                            className="btn-press flex-1 py-3 border-2 border-peach-500 dark:border-pink-500 text-peach-600 dark:text-pink-400 rounded-full font-semibold hover:bg-peach-50 dark:hover:bg-gray-700 transition-all duration-300"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="btn-press shine-sweep flex-1 py-3 bg-gradient-to-r from-peach-500 to-peach-600 dark:from-orange-600 dark:to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4 group-hover:animate-bounce" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </Anim>
                ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────────────────────── */}
      <section id="benefits" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Anim className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose PREFERABLE?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Trusted by thousands of parents worldwide
            </p>
          </Anim>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Made with Love",
                description:
                  "Every product is crafted with care and the finest natural ingredients",
              },
              {
                icon: Shield,
                title: "Dermatologist Tested",
                description:
                  "Clinically proven safe for sensitive baby skin and hypoallergenic",
              },
              {
                icon: Sparkles,
                title: "Natural Ingredients",
                description:
                  "Free from harsh chemicals, parabens, and artificial fragrances",
              },
            ].map((feature, index) => (
              <Anim key={index} delay={index * 140}>
                <div className="group card-hover p-8 rounded-2xl bg-gradient-to-br from-peach-50 dark:from-gray-800 to-white dark:to-gray-900 border border-peach-200 dark:border-gray-700">
                  <div className="icon-box w-16 h-16 bg-gradient-to-br from-peach-400 to-peach-500 dark:from-orange-600 dark:to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white dark:from-gray-900 to-orange-50 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Anim className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Parents Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real experiences from families who love PREFERABLE
            </p>
          </Anim>

          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, idx) => (
              <Anim key={idx} type="reveal-scale" delay={idx * 160}>
                <div className="group card-hover bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                  <Quote className="w-10 h-10 text-orange-400 dark:text-pink-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <div className="flex items-center mb-4 star-row">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="star-icon w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "Sample testimonial text for parent {idx + 1}."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 dark:from-pink-500 dark:to-orange-600 rounded-full flex-shrink-0"
                      style={{
                        animation: `float ${3.5 + idx * 0.5}s ease-in-out ${idx * 0.3}s infinite`,
                      }}
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Parent {idx + 1}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Mother/Father of {idx + 1}
                      </p>
                    </div>
                  </div>
                </div>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 dark:from-orange-600 dark:to-pink-600 py-16 md:py-20 overflow-hidden relative">
        {/* Decorative floating orbs */}
        <div
          className="absolute top-6 left-16 w-28 h-28 rounded-full bg-white/10 pointer-events-none"
          style={{ animation: "float 5s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-6 right-20 w-16 h-16 rounded-full bg-white/10 pointer-events-none"
          style={{ animation: "float 4s ease-in-out 1.2s infinite" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-10 h-10 rounded-full bg-white/5 pointer-events-none"
          style={{ animation: "float 6s ease-in-out 0.6s infinite" }}
        />

        <Anim className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Give Your Child The Best Natural Care
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of happy parents who trust PREFERABLE for their
            children's skincare
          </p>
          <button
            onClick={() => onNavigate("products")}
            className="btn-press shine-sweep bg-white text-orange-600 dark:text-orange-500 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Order Now
          </button>
        </Anim>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Anim type="reveal-scale">
            <div className="bg-orange-100 dark:bg-gray-800 rounded-3xl p-12 text-center text-black dark:text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Reach Out to Us
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Have questions or need assistance? Message our customer service
                directly on WhatsApp.
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
                  const whatsappNumber = "2348142401236";
                  const message = `Hello Preferable Team! 👋\n\nMy name is ${nameInput}.\nEmail: ${emailInput}\nMessage: ${messageInput}\n\nLooking forward to your response. Thank you!`;
                  window.open(
                    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
                    "_blank",
                  );
                }}
                className="max-w-md mx-auto flex flex-col gap-4"
              >
                {(["name", "email", "message"] as const).map((name, i) => {
                  const sharedCls =
                    "field-focus px-6 py-4 rounded-2xl text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none w-full";
                  const style = {
                    animation: `fadeUp 0.5s ease ${i * 100}ms both`,
                  };
                  return name === "message" ? (
                    <textarea
                      key={name}
                      name={name}
                      placeholder="Your Message"
                      required
                      rows={4}
                      className={`${sharedCls} resize-none`}
                      style={style}
                    />
                  ) : (
                    <input
                      key={name}
                      type={name === "email" ? "email" : "text"}
                      name={name}
                      placeholder={name === "name" ? "Your Name" : "Your Email"}
                      required
                      className={sharedCls}
                      style={style}
                    />
                  );
                })}
                <button
                  type="submit"
                  className="btn-press shine-sweep px-8 py-4 bg-white dark:bg-gray-700 text-peach-600 dark:text-peach-400 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
                >
                  Message Us
                </button>
              </form>
            </div>
          </Anim>
        </div>
      </section>
    </div>
  );
};
