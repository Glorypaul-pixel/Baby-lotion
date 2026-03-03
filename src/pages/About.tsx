import React, { useEffect, useRef, useState } from "react";
import { Heart, Leaf, Award, Users } from "lucide-react";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const ABOUT_STYLES = `
  @keyframes heroTitle {
    0%   { opacity:0; transform: perspective(800px) rotateX(90deg) translateY(-60px); filter: blur(20px); }
    60%  { filter: blur(0); }
    100% { opacity:1; transform: perspective(800px) rotateX(0deg) translateY(0); }
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
  @keyframes floatY {
    0%,100% { transform: translateY(0) rotate(0deg); }
    33%      { transform: translateY(-16px) rotate(2deg); }
    66%      { transform: translateY(-7px) rotate(-1deg); }
  }
  @keyframes morphBlob {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    50%      { border-radius: 50% 60% 30% 40% / 70% 30% 50% 60%; }
    75%      { border-radius: 40% 30% 60% 70% / 30% 70% 40% 50%; }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 20px rgba(249,115,22,0.3), 0 0 60px rgba(249,115,22,0.08); }
    50%      { box-shadow: 0 0 40px rgba(249,115,22,0.7), 0 0 100px rgba(249,115,22,0.2); }
  }
  @keyframes orbitRing {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes orbitRingReverse {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes waveText {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-7px); }
  }
  @keyframes iconDance {
    0%,100% { transform: rotate(0)    scale(1); }
    25%      { transform: rotate(15deg) scale(1.1); }
    50%      { transform: rotate(-5deg) scale(0.95); }
    75%      { transform: rotate(10deg) scale(1.05); }
  }
  @keyframes dotPulse {
    0%,100% { transform: scale(1);   opacity: 0.7; }
    50%      { transform: scale(1.6); opacity: 1; }
  }
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  .ab-reveal-up    { opacity:0; transform: translateY(36px); transition: opacity 0.65s ease, transform 0.65s cubic-bezier(.22,.68,0,1.2); }
  .ab-reveal-up.on { opacity:1; transform: translateY(0); }
  .ab-reveal-flip      { opacity:0; }
  .ab-reveal-flip.on   { animation: cardFlip 0.7s cubic-bezier(.22,.68,0,1.2) both; }
  .ab-reveal-left      { opacity:0; transform: translateX(-40px); transition: opacity 0.65s ease, transform 0.65s cubic-bezier(.22,.68,0,1.2); }
  .ab-reveal-left.on   { opacity:1; transform: translateX(0); }
  .ab-reveal-right     { opacity:0; transform: translateX(40px); transition: opacity 0.65s ease, transform 0.65s cubic-bezier(.22,.68,0,1.2); }
  .ab-reveal-right.on  { opacity:1; transform: translateX(0); }
  .ab-blob { position: absolute; pointer-events: none; animation: morphBlob 9s ease-in-out infinite; filter: blur(2px); }
  .ab-shimmer { background: linear-gradient(135deg, #f97316 0%, #ec4899 50%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .ab-icon-box { transition: transform 0.3s cubic-bezier(.22,.68,0,1.2); }
  .ab-card:hover .ab-icon-box { animation: iconDance 0.6s ease both; }
  .ab-card { transition: transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease; }
  .ab-card:hover { transform: translateY(-10px) scale(1.02); }
  .ab-dot { animation: dotPulse 2s ease-in-out infinite; }
  .ab-ticker-track { animation: ticker 22s linear infinite; display:flex; width:max-content; }
  .ab-ticker-wrap  { overflow: hidden; }
  .ab-wave-char { display:inline-block; }
  @media(hover:none){.ab-blob{display:none;}}
`;

function useAboutStyles() {
  useEffect(() => {
    if (document.getElementById("pref-about-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-about-styles";
    s.textContent = ABOUT_STYLES;
    document.head.appendChild(s);
  }, []);
}

const Reveal: React.FC<{
  children: React.ReactNode;
  type?: "up" | "flip" | "left" | "right";
  delay?: number;
  className?: string;
}> = ({ children, type = "up", delay = 0, className = "" }) => {
  const { ref, visible } = useInView();
  const cls = { up: "ab-reveal-up", flip: "ab-reveal-flip", left: "ab-reveal-left", right: "ab-reveal-right" }[type];
  return (
    <div
      ref={ref}
      className={`${cls} ${visible ? "on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, animationDelay: visible ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
};

const WaveText: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => (
  <span className={className}>
    {text.split("").map((ch, i) => (
      <span key={i} className="ab-wave-char" style={{ animation: `waveText 1.6s ease-in-out ${i * 70}ms infinite` }}>
        {ch === " " ? "\u00A0" : ch}
      </span>
    ))}
  </span>
);

function useTilt(strength = 10) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) scale(1.03)`;
    };
    const onLeave = () => { el.style.transition = "transform 0.5s ease"; el.style.transform = "perspective(900px) rotateY(0) rotateX(0) scale(1)"; };
    const onEnter = () => { el.style.transition = "transform 0.1s ease"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseenter", onEnter);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); el.removeEventListener("mouseenter", onEnter); };
  }, [strength]);
  return ref;
}

export const About: React.FC = () => {
  useAboutStyles();

  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  const tiltImg   = useTilt(6);
  const tiltCard0 = useTilt(8);
  const tiltCard1 = useTilt(8);
  const tiltCard2 = useTilt(8);
  const tiltCard3 = useTilt(8);
  const tiltRefs  = [tiltCard0, tiltCard1, tiltCard2, tiltCard3];

  const tickerItems = ["✦ MADE WITH LOVE", "✦ 100% NATURAL", "✦ AWARD WINNING", "✦ 50K+ FAMILIES", "✦ DERMATOLOGIST TESTED", "✦ ECO-FRIENDLY", "✦ PARABEN FREE"];

  const values = [
    { icon: Heart, title: "Made with Love",  description: "Every product is crafted with genuine care and attention to detail", color: "#ec4899", bg: "from-pink-400 to-orange-400" },
    { icon: Leaf,  title: "100% Natural",    description: "We use only the finest natural ingredients, free from harsh chemicals", color: "#84cc16", bg: "from-green-400 to-emerald-400" },
    { icon: Award, title: "Award Winning",   description: "Recognized by pediatricians and parents worldwide", color: "#fbbf24", bg: "from-yellow-400 to-amber-400" },
    { icon: Users, title: "Trusted by 50k+", description: "Over 50,000 happy families use our products daily", color: "#06b6d4", bg: "from-blue-400 to-cyan-400" },
  ];

  const promises = [
    { label: "Safety First",      text: "Every ingredient is carefully selected and tested to ensure it's safe for your baby's delicate skin.", color: "#f97316" },
    { label: "Transparency",      text: "We list every ingredient clearly. You'll never find hidden chemicals or mysterious additives in our products.", color: "#ec4899" },
    { label: "Sustainability",    text: "We're committed to protecting the planet for future generations with eco-friendly packaging and practices.", color: "#84cc16" },
    { label: "Your Satisfaction", text: "If you're not completely happy, we'll make it right. Your trust means everything to us.", color: "#fbbf24" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* HERO */}
      <section className="relative pt-24 sm:pt-28 pb-14 sm:pb-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fce7f3 50%, #fef9c3 100%)" }}>
        <div className="ab-blob w-80 h-80 bg-orange-300 opacity-20 top-[-60px] left-[-60px] hidden sm:block" style={{ animationDuration: "9s" }} />
        <div className="ab-blob w-56 h-56 bg-pink-300 opacity-15 bottom-[-30px] right-[-30px] hidden sm:block" style={{ animationDuration: "11s", animationDelay: "3s" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`inline-block px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-xs sm:text-sm font-black mb-4 sm:mb-6 transition-all duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
            style={{ background: "linear-gradient(135deg, #f97316, #ec4899, #fbbf24)", animation: ready ? "badgePop 0.6s cubic-bezier(.22,.68,0,1.4) both" : "none" }}
          >
            ✦ OUR STORY ✦
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 leading-tight"
            style={{
              fontFamily: "'Syne', sans-serif",
              animation: ready ? "heroTitle 1s cubic-bezier(.22,.68,0,1.2) 0.1s both" : "none",
              opacity: ready ? undefined : 0,
            }}
          >
            <span className="ab-shimmer">About Preferrable</span>
          </h1>

          <p
            className={`text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed ab-reveal-up ${ready ? "on" : ""}`}
            style={{ transitionDelay: "400ms" }}
          >
            We believe every baby deserves the gentlest care. That's why we create
            premium, natural products with love.
          </p>
        </div>
      </section>

      {/* TICKER */}
      <div className="ab-ticker-wrap py-2.5 sm:py-3" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)", borderTop: "2px solid #fbbf24", borderBottom: "2px solid #fbbf24" }}>
        <div className="ab-ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-white font-black text-xs sm:text-sm tracking-widest px-5 sm:px-8 flex-shrink-0">{item}</span>
          ))}
        </div>
      </div>

      {/* STORY */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="ab-blob w-64 h-64 bg-orange-200 opacity-15 top-10 right-10 hidden sm:block" style={{ animationDuration: "10s" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">

            {/* Image */}
            <Reveal type="left">
              <div
                ref={tiltImg}
                className="relative h-64 sm:h-80 lg:h-[420px] rounded-3xl overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="absolute w-[108%] h-[108%] rounded-full border-2 border-dashed border-orange-300/40 hidden sm:block" style={{ animation: "orbitRing 14s linear infinite" }} />
                  <div className="absolute w-[116%] h-[116%] rounded-full border border-dotted border-pink-300/30 hidden sm:block" style={{ animation: "orbitRingReverse 20s linear infinite" }} />
                </div>
                <div className="absolute inset-4 rounded-3xl z-0" style={{ background: "linear-gradient(135deg, #f97316, #ec4899)", animation: "pulseGlow 3s ease-in-out infinite", filter: "blur(20px)", opacity: 0.35 }} />
                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden" style={{ animation: "floatY 5s ease-in-out infinite" }}>
                  <img src="/images/aboutImg.png" alt="Baby care" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
            </Reveal>

            {/* Copy */}
            <div className="flex flex-col justify-center space-y-4 sm:space-y-5">
              <Reveal type="right" delay={0}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Our <span className="ab-shimmer">Story</span>
                </h2>
              </Reveal>
              {[
                "Preferrable was born from a parent's love and a simple desire: to create the safest, most gentle products for babies. Our founder, inspired by the arrival of their first child, couldn't find products that met their high standards for purity and gentleness.",
                "Every Preferrable product is carefully formulated with natural ingredients, dermatologist-tested, and made with the same care we'd use for our own children. We believe that baby care should be simple, safe, and effective.",
                "Today, thousands of families trust Preferrable to care for their little ones, and we're honored to be part of your family's journey.",
              ].map((para, i) => (
                <Reveal key={i} type="right" delay={i * 130 + 100}>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 sm:py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fce7f3 60%, #fef9c3 100%)" }}>
        <div className="ab-blob w-72 h-72 bg-pink-300 opacity-15 bottom-0 left-0 hidden sm:block" style={{ animationDuration: "8s", animationDelay: "1s" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-gray-900 dark:text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              <WaveText text="What We Stand For" />
            </h2>
            <p className="text-base sm:text-xl text-gray-500">The values behind every product we make</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {values.map((v, i) => (
              <Reveal key={i} type="flip" delay={i * 130}>
                <div
                  ref={tiltRefs[i]}
                  className="ab-card group p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 hidden sm:block" style={{ background: v.color, animation: "morphBlob 5s ease infinite" }} />
                  <div className={`ab-icon-box w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${v.bg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 relative z-10`}>
                    <v.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2 relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>{v.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm relative z-10 leading-relaxed">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISE */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="ab-blob w-56 h-56 bg-yellow-300 opacity-10 top-10 right-20 hidden sm:block" style={{ animationDuration: "12s" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal type="flip">
            <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fce7f3 50%, #fef9c3 100%)" }}>
              <div className="ab-blob w-48 h-48 bg-orange-300 opacity-20 top-0 left-0 hidden sm:block" style={{ animationDuration: "8s" }} />
              <div className="ab-blob w-36 h-36 bg-pink-300 opacity-15 bottom-0 right-0 hidden sm:block" style={{ animationDuration: "10s", animationDelay: "2s" }} />

              <div className="max-w-4xl mx-auto relative z-10">
                <Reveal className="text-center mb-8 sm:mb-10">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 text-gray-900 dark:text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Our <span className="ab-shimmer">Promise</span>
                  </h2>
                </Reveal>

                <div className="space-y-4 sm:space-y-6">
                  {promises.map((p, i) => (
                    <Reveal key={i} type={i % 2 === 0 ? "left" : "right"} delay={i * 120}>
                      <div
                        className="group flex items-start gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
                        style={{ transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateX(8px) scale(1.01)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${p.color}33`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
                      >
                        <div className="ab-dot w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex-shrink-0 mt-1" style={{ background: p.color, animationDelay: `${i * 300}ms` }} />
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                          <strong className="font-black text-gray-900 dark:text-white">{p.label}: </strong>
                          {p.text}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};