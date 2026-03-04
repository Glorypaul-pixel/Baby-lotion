import React, { useEffect, useRef, useState } from "react";
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
  @keyframes heroTitle{0%{opacity:0;transform:perspective(800px) rotateX(90deg) translateY(-40px);filter:blur(16px);}60%{filter:blur(0);}100%{opacity:1;transform:perspective(800px) rotateX(0) translateY(0);}}
  @keyframes cardFlip{0%{transform:perspective(1000px) rotateY(-8deg) rotateX(4deg) scale(.92);opacity:0;}100%{transform:perspective(1000px) rotateY(0) rotateX(0) scale(1);opacity:1;}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
  @keyframes morphBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;}50%{border-radius:50% 60% 30% 40%/70% 30% 50% 60%;}75%{border-radius:40% 30% 60% 70%/30% 70% 40% 50%;}}
  @keyframes badgePop{0%{transform:scale(0) rotate(-20deg);opacity:0;}70%{transform:scale(1.2) rotate(5deg);}85%{transform:scale(.95) rotate(-2deg);}100%{transform:scale(1) rotate(0);opacity:1;}}
  @keyframes stepPop{0%{transform:scale(0) rotate(-10deg);opacity:0;}70%{transform:scale(1.15);}100%{transform:scale(1);opacity:1;}}
  @keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
  @keyframes waveText{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
  @keyframes iconDance{0%,100%{transform:rotate(0) scale(1);}25%{transform:rotate(15deg) scale(1.1);}50%{transform:rotate(-5deg) scale(.95);}75%{transform:rotate(10deg) scale(1.05);}}
  .rt-blob{position:absolute;pointer-events:none;animation:morphBlob 9s ease-in-out infinite;filter:blur(2px);}
  .ab-shimmer{background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .rt-up{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,.68,0,1.2);}
  .rt-up.on{opacity:1;transform:translateY(0);}
  .rt-left{opacity:0;transform:translateX(-32px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,.68,0,1.2);}
  .rt-left.on{opacity:1;transform:translateX(0);}
  .rt-flip{opacity:0;}
  .rt-flip.on{animation:cardFlip .65s cubic-bezier(.22,.68,0,1.2) both;}
  .rt-card{transition:transform .35s cubic-bezier(.22,.68,0,1.2),box-shadow .35s ease;}
  .rt-card:hover{transform:translateY(-6px) scale(1.01);}
  .rt-icon{transition:transform .3s ease;}
  .rt-card:hover .rt-icon{animation:iconDance .6s ease both;}
  .step-row{transition:transform .25s ease,box-shadow .25s ease;}
  .step-row:hover{transform:translateX(6px);box-shadow:0 4px 16px rgba(249,115,22,.1);}
  .step-num{animation:stepPop .5s cubic-bezier(.22,.68,0,1.4) both;}
  .cta-btn{transition:transform .2s ease;position:relative;overflow:hidden;display:inline-flex;align-items:center;}
  .cta-btn:hover{transform:scale(1.05);}
  .cta-btn::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.25) 50%,transparent 60%);transform:translateX(-100%);transition:transform .5s ease;}
  .cta-btn:hover::after{transform:translateX(100%);}
  .tick-track{animation:ticker 24s linear infinite;display:flex;width:max-content;}
  .tick-wrap{overflow:hidden;}
  .wave-char{display:inline-block;}
`;

function useStyles() {
  useEffect(() => {
    if (document.getElementById("pref-rt-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-rt-styles";
    s.textContent = STYLES;
    document.head.appendChild(s);
  }, []);
}
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

type RevealProps = {
  children: React.ReactNode;
  type?: "up" | "flip" | "left";
  delay?: number;
  className?: string;
};
const Reveal: React.FC<RevealProps> = ({
  children,
  type = "up",
  delay = 0,
  className = "",
}) => {
  const { ref, v } = useInView();
  const cls = { up: "rt-up", flip: "rt-flip", left: "rt-left" }[type];
  return (
    <div
      ref={ref}
      className={`${cls} ${v ? "on" : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        animationDelay: v ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
};

const WaveText: React.FC<{ text: string }> = ({ text }) => (
  <span>
    {text.split("").map((ch, i) => (
      <span
        key={i}
        className="wave-char"
        style={{
          animation: `waveText 1.6s ease-in-out ${i * 75}ms infinite`,
          display: "inline-block",
        }}
      >
        {ch === " " ? " " : ch}
      </span>
    ))}
  </span>
);

const steps = [
  {
    num: "1",
    title: "Contact Us",
    desc: "Email tsmglobalcosmetic or call (+234) 080-6703-0009 to initiate your return. We will provide a return authorization number.",
    color: "#f97316",
  },
  {
    num: "2",
    title: "Package Your Item",
    desc: "Securely pack the item in its original packaging. Include your return authorization number and proof of purchase.",
    color: "#ec4899",
  },
  {
    num: "3",
    title: "Ship It Back",
    desc: "Ship the package to the address provided in your return authorization email. We recommend using a trackable shipping method.",
    color: "#fbbf24",
  },
  {
    num: "4",
    title: "Get Your Refund",
    desc: "Once we receive your return, we will process it within 5-7 business days. Your refund will be issued to your original payment method.",
    color: "#84cc16",
  },
];
const boxes = [
  {
    icon: CheckCircle,
    title: "Returnable",
    items: ["Unopened products", "Damaged items", "Wrong items sent"],
    color: "#22c55e",
    border: "rgba(34,197,94,.3)",
    bg: "rgba(34,197,94,.06)",
  },
  {
    icon: XCircle,
    title: "Non-Returnable",
    items: ["Opened products", "Items past 30 days", "Gift cards"],
    color: "#ef4444",
    border: "rgba(239,68,68,.3)",
    bg: "rgba(239,68,68,.06)",
  },
  {
    icon: AlertCircle,
    title: "Important Notes",
    items: [
      "Free return shipping",
      "Exchanges available",
      "5-7 day processing",
    ],
    color: "#3b82f6",
    border: "rgba(59,130,246,.3)",
    bg: "rgba(59,130,246,.06)",
  },
];

export const Returns: React.FC = () => {
  useStyles();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);
  const ticks = [
    "RETURNS POLICY",
    "30-DAY GUARANTEE",
    "FREE RETURNS",
    "EASY EXCHANGES",
    "YOUR SATISFACTION",
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
        className="rt-blob w-80 h-80 bg-orange-300 opacity-20"
        style={{
          position: "absolute",
          top: "-60px",
          left: "-60px",
          animationDuration: "9s",
        }}
      />
      <div
        className="rt-blob w-60 h-60 bg-pink-300 opacity-15"
        style={{
          position: "absolute",
          bottom: "60px",
          right: "-40px",
          animationDuration: "11s",
          animationDelay: "3s",
        }}
      />
      <section className="relative pt-28 pb-12 text-center z-10">
        <div
          className="inline-block px-5 py-2.5 rounded-full text-white text-sm font-black mb-6"
          style={{
            background: "linear-gradient(135deg,#f97316,#ec4899,#fbbf24)",
            animation: ready
              ? "badgePop .6s cubic-bezier(.22,.68,0,1.4) both"
              : "none",
            opacity: ready ? undefined : 0,
          }}
        >
          CUSTOMER CARE
        </div>
        <h1
          className="text-5xl md:text-7xl font-black mb-4"
          style={{
            fontFamily: "'Nunito', sans-serif",
            animation: ready
              ? "heroTitle 1s cubic-bezier(.22,.68,0,1.2) .1s both"
              : "none",
            opacity: ready ? undefined : 0,
          }}
        >
          <span className="ab-shimmer">Returns</span> &amp; Exchanges
        </h1>
        <p
          className={`text-xl text-gray-600 rt-up ${ready ? "on" : ""}`}
          style={{ transitionDelay: "350ms" }}
        >
          Your satisfaction is our priority
        </p>
      </section>
      <div
        className="tick-wrap py-3 mb-14"
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
              className="text-white font-black text-sm tracking-widest px-8 flex-shrink-0"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
        <Reveal type="flip">
          <div className="rt-card bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div
              className="rt-blob w-32 h-32 bg-orange-200 opacity-20"
              style={{
                position: "absolute",
                top: "-30px",
                right: "-30px",
                animationDuration: "7s",
              }}
            />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div
                className="rt-icon w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#f97316,#ec4899)",
                }}
              >
                <RotateCcw className="w-7 h-7 text-white" />
              </div>
              <h2
                className="text-2xl font-black text-gray-900 dark:text-white"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                30-Day <span className="ab-shimmer">Return Policy</span>
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-400 relative z-10">
              <p>
                We want you to be completely satisfied with your purchase. If
                you are not happy with your order, you can return it within 30
                days of delivery for a full refund or exchange.
              </p>
              <p className="font-black text-gray-900 dark:text-white">
                To be eligible for a return, items must be:
              </p>
              <ul className="space-y-2 ml-2">
                {[
                  "Unused and in the same condition that you received them",
                  "In the original packaging",
                  "Accompanied by proof of purchase",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-white text-xs font-black step-num"
                      style={{
                        background: "linear-gradient(135deg,#f97316,#ec4899)",
                        animationDelay: `${i * 80}ms`,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
        <Reveal type="flip" delay={80}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div
              className="rt-blob w-28 h-28 bg-pink-200 opacity-20"
              style={{
                position: "absolute",
                bottom: "-20px",
                left: "-20px",
                animationDuration: "8s",
                animationDelay: "2s",
              }}
            />
            <h2
              className="text-2xl font-black mb-7 text-gray-900 dark:text-white relative z-10"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              How to <span className="ab-shimmer">Return an Item</span>
            </h2>
            <div className="space-y-4 relative z-10">
              {steps.map((step, i) => (
                <Reveal key={i} type="left" delay={i * 100}>
                  <div className="step-row flex items-start gap-5 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                    <div
                      className="step-num w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-black"
                      style={{
                        background: `linear-gradient(135deg,${step.color},#ec4899)`,
                        animationDelay: `${i * 100 + 200}ms`,
                      }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <h3
                        className="font-black text-gray-900 dark:text-white mb-1"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {boxes.map((box, i) => (
            <Reveal key={i} type="flip" delay={i * 120}>
              <div
                className="rt-card group rounded-2xl p-6 border-2 relative overflow-hidden"
                style={{ background: box.bg, borderColor: box.border }}
              >
                <div
                  className="rt-blob w-20 h-20 opacity-20"
                  style={{
                    position: "absolute",
                    top: "-16px",
                    right: "-16px",
                    background: box.color,
                    animationDuration: `${6 + i}s`,
                  }}
                />
                <div
                  className="rt-icon w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10"
                  style={{ background: `${box.color}22` }}
                >
                  <box.icon className="w-6 h-6" style={{ color: box.color }} />
                </div>
                <h3
                  className="font-black text-gray-900 dark:text-white mb-3 relative z-10"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  {box.title}
                </h3>
                <ul className="space-y-1.5 relative z-10">
                  {box.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: box.color }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal type="flip" delay={100}>
          <div
            className="rounded-3xl p-10 text-white text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg,#f97316 0%,#ec4899 100%)",
            }}
          >
            <div
              className="rt-blob w-40 h-40 bg-white opacity-10"
              style={{
                position: "absolute",
                top: "-40px",
                left: "-40px",
                animationDuration: "7s",
              }}
            />
            <h2
              className="text-3xl font-black mb-3 relative z-10"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              <WaveText text="Questions About Returns?" />
            </h2>
            <p className="mb-7 text-white/90 text-lg relative z-10">
              Our team is here to make your return as smooth as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <a
                href="mailto:tsmglobalcosmetic@gmail.com"
                className="cta-btn px-8 py-3.5 bg-white rounded-full font-black text-sm"
                style={{ color: "#f97316" }}
              >
                <Mail className="w-4 h-4 mr-1.5" />
                Email Support
              </a>
              <a
                href="tel:+2348142401236"
                className="cta-btn px-8 py-3.5 rounded-full font-black text-sm text-white"
                style={{
                  background: "rgba(255,255,255,.18)",
                  border: "2px solid rgba(255,255,255,.4)",
                }}
              >
                <Phone className="w-4 h-4 mr-1.5" />
                Call Us
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
