import React, { useEffect, useRef, useState } from "react";
import { Truck, Package, Globe, Clock } from "lucide-react";

const STYLES = `
  @keyframes heroTitle{0%{opacity:0;transform:perspective(800px) rotateX(90deg) translateY(-40px);filter:blur(16px);}60%{filter:blur(0);}100%{opacity:1;transform:perspective(800px) rotateX(0) translateY(0);}}
  @keyframes cardFlip{0%{transform:perspective(1000px) rotateY(-8deg) rotateX(4deg) scale(.92);opacity:0;}100%{transform:perspective(1000px) rotateY(0) rotateX(0) scale(1);opacity:1;}}
  @keyframes morphBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;}50%{border-radius:50% 60% 30% 40%/70% 30% 50% 60%;}75%{border-radius:40% 30% 60% 70%/30% 70% 40% 50%;}}
  @keyframes badgePop{0%{transform:scale(0) rotate(-20deg);opacity:0;}70%{transform:scale(1.2) rotate(5deg);}85%{transform:scale(.95) rotate(-2deg);}100%{transform:scale(1) rotate(0);opacity:1;}}
  @keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
  @keyframes waveText{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
  @keyframes iconDance{0%,100%{transform:rotate(0) scale(1);}25%{transform:rotate(15deg) scale(1.1);}50%{transform:rotate(-5deg) scale(.95);}75%{transform:rotate(10deg) scale(1.05);}}
  @keyframes rowSlide{from{opacity:0;transform:translateX(-20px);}to{opacity:1;transform:translateX(0);}}
  .sh-blob{position:absolute;pointer-events:none;animation:morphBlob 9s ease-in-out infinite;filter:blur(2px);}
  .ab-shimmer{background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .sh-up{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,.68,0,1.2);}
  .sh-up.on{opacity:1;transform:translateY(0);}
  .sh-flip{opacity:0;}
  .sh-flip.on{animation:cardFlip .65s cubic-bezier(.22,.68,0,1.2) both;}
  .sh-card{transition:transform .35s cubic-bezier(.22,.68,0,1.2),box-shadow .35s ease;}
  .sh-card:hover{transform:translateY(-6px) scale(1.01);}
  .sh-icon{transition:transform .3s ease;}
  .sh-card:hover .sh-icon{animation:iconDance .6s ease both;}
  .sh-row{transition:transform .25s ease,box-shadow .25s ease;animation:rowSlide .5s ease both;}
  .sh-row:hover{transform:translateX(5px);box-shadow:0 4px 16px rgba(249,115,22,.1);}
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
    if (document.getElementById("pref-sh-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-sh-styles";
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
  type?: "up" | "flip";
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
  const cls = type === "flip" ? "sh-flip" : "sh-up";
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
        {ch === " " ? "\u00A0" : ch}
      </span>
    ))}
  </span>
);

const sections = [
  {
    icon: Truck,
    title: "Shipping Methods",
    color: "#f97316",
    grad: "from-orange-400 to-pink-400",
    content: (
      <div className="space-y-3">
        {[
          {
            name: "Standard Shipping — FREE",
            desc: "Delivery in 3-5 business days. Available on all orders.",
          },
          {
            name: "Express Shipping — $9.99",
            desc: "Delivery in 1-2 business days. Perfect when you need it fast.",
          },
          {
            name: "Next Day Shipping — $19.99",
            desc: "Order by 2 PM for next-day delivery. Available in select areas.",
          },
        ].map((opt, i) => (
          <div
            key={i}
            className="sh-row p-3 sm:p-4 rounded-xl bg-orange-50 dark:bg-gray-700/50"
            style={{ animationDelay: `${i * 80 + 200}ms` }}
          >
            <h3
              className="font-black text-gray-900 dark:text-white mb-1 text-sm sm:text-base"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              {opt.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {opt.desc}
            </p>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Package,
    title: "Order Processing",
    color: "#3b82f6",
    grad: "from-blue-400 to-blue-500",
    content: (
      <div className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
        <p>
          Orders are processed Monday through Friday, excluding holidays. Orders
          placed after 2 PM will be processed the next business day.
        </p>
        <p>
          You will receive a confirmation email when your order is placed, and a
          shipping notification with tracking information once your order ships.
        </p>
      </div>
    ),
  },
  {
    icon: Globe,
    title: "International Shipping",
    color: "#22c55e",
    grad: "from-green-400 to-emerald-500",
    content: (
      <div className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
        <p>
          We currently ship to Ghana, Cameroon, Togo, and other parts of Africa,
          as well as select international destinations. Shipping times and costs
          vary by location.
        </p>
        <p>
          International orders may be subject to customs fees, duties, and
          taxes, which are the responsibility of the customer.
        </p>
      </div>
    ),
  },
];

export const Shipping: React.FC = () => {
  useStyles();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);
  const ticks = [
    "\u2726 SHIPPING INFO",
    "\u2726 FAST DELIVERY",
    "\u2726 FREE STANDARD",
    "\u2726 INTERNATIONAL",
    "\u2726 TRACK YOUR ORDER",
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
      {/* Blobs */}
      <div
        className="sh-blob hidden sm:block"
        style={{
          width: "18rem",
          height: "18rem",
          background: "#fdba74",
          opacity: 0.2,
          position: "absolute",
          top: "-60px",
          left: "-60px",
          animationDuration: "9s",
        }}
      />
      <div
        className="sh-blob hidden sm:block"
        style={{
          width: "14rem",
          height: "14rem",
          background: "#f9a8d4",
          opacity: 0.15,
          position: "absolute",
          bottom: "60px",
          right: "-40px",
          animationDuration: "11s",
          animationDelay: "3s",
        }}
      />

      {/* Hero */}
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
          DELIVERY
        </div>
        <h1
          className="font-black mb-3 sm:mb-4 text-4xl sm:text-5xl md:text-7xl leading-tight"
          style={{
            fontFamily: "Syne,sans-serif",
            animation: ready
              ? "heroTitle 1s cubic-bezier(.22,.68,0,1.2) .1s both"
              : "none",
            opacity: ready ? undefined : 0,
          }}
        >
          <span className="ab-shimmer">Shipping</span> Information
        </h1>
        <p
          className={`text-base sm:text-xl text-gray-600 sh-up ${ready ? "on" : ""}`}
          style={{ transitionDelay: "350ms" }}
        >
          Fast, reliable delivery to your doorstep
        </p>
      </section>

      {/* Ticker */}
      <div
        className="tick-wrap py-2.5 sm:py-3 mb-10 sm:mb-14"
        style={{
          background: "linear-gradient(90deg,#f97316,#ec4899)",
          borderTop: "2px solid #fbbf24",
          borderBottom: "2px solid #fbbf24",
        }}
      >
        <div className="tick-track">
          {[...ticks, ...ticks].map((t, idx) => (
            <span
              key={idx}
              className="text-white font-black text-xs sm:text-sm tracking-widest px-5 sm:px-8 flex-shrink-0"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pb-16 sm:pb-24 space-y-4 sm:space-y-6">
        {sections.map((sec, i) => (
          <Reveal key={i} type="flip" delay={i * 100}>
            <div className="sh-card bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
              <div
                className="sh-blob"
                style={{
                  width: "7rem",
                  height: "7rem",
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  background: sec.color,
                  opacity: 0.15,
                  animationDuration: `${7 + i}s`,
                }}
              />
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10">
                <div
                  className={`sh-icon w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${sec.grad}`}
                >
                  <sec.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <h2
                  className="text-base sm:text-2xl font-black text-gray-900 dark:text-white"
                  style={{ fontFamily: "Syne,sans-serif" }}
                >
                  {sec.title}
                </h2>
              </div>
              <div className="relative z-10">{sec.content}</div>
            </div>
          </Reveal>
        ))}

        {/* CTA */}
        <Reveal type="flip" delay={300}>
          <div
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg,#f97316 0%,#ec4899 100%)",
            }}
          >
            <div
              className="sh-blob"
              style={{
                width: "9rem",
                height: "9rem",
                background: "white",
                opacity: 0.1,
                position: "absolute",
                top: "-30px",
                left: "-30px",
                animationDuration: "7s",
              }}
            />
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5 relative z-10">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 mt-1" />
              <h2
                className="text-xl sm:text-2xl font-black"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                <WaveText text="Need Help?" />
              </h2>
            </div>
            <p className="mb-2 text-white/90 relative z-10 text-sm sm:text-base">
              Have questions about shipping? Our customer service team is here
              to help!
            </p>
            <p className="font-black relative z-10 text-sm sm:text-base break-words">
              Contact us at tsmglobalcosmetic or call (+234) 080-6703-0009
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
