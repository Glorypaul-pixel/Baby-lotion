import React, { useEffect, useRef, useState } from "react";
import { RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react";

const STYLES = `
  @keyframes heroTitle{0%{opacity:0;transform:perspective(800px) rotateX(90deg) translateY(-40px);filter:blur(16px);}60%{filter:blur(0);}100%{opacity:1;transform:perspective(800px) rotateX(0) translateY(0);}}
  @keyframes cardFlip{0%{transform:perspective(1000px) rotateY(-8deg) rotateX(4deg) scale(.92);opacity:0;}100%{transform:perspective(1000px) rotateY(0) rotateX(0) scale(1);opacity:1;}}
  @keyframes morphBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;}50%{border-radius:50% 60% 30% 40%/70% 30% 50% 60%;}75%{border-radius:40% 30% 60% 70%/30% 70% 40% 50%;}}
  @keyframes badgePop{0%{transform:scale(0) rotate(-20deg);opacity:0;}70%{transform:scale(1.2) rotate(5deg);}85%{transform:scale(.95) rotate(-2deg);}100%{transform:scale(1) rotate(0);opacity:1;}}
  @keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
  @keyframes waveText{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
  @keyframes iconDance{0%,100%{transform:rotate(0) scale(1);}25%{transform:rotate(15deg) scale(1.1);}50%{transform:rotate(-5deg) scale(.95);}75%{transform:rotate(10deg) scale(1.05);}}
  @keyframes rowSlide{from{opacity:0;transform:translateX(-20px);}to{opacity:1;transform:translateX(0);}}
  .rt-blob{position:absolute;pointer-events:none;animation:morphBlob 9s ease-in-out infinite;filter:blur(2px);}
  .rt-shimmer{background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .rt-up{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,.68,0,1.2);}
  .rt-up.on{opacity:1;transform:translateY(0);}
  .rt-flip{opacity:0;}
  .rt-flip.on{animation:cardFlip .65s cubic-bezier(.22,.68,0,1.2) both;}
  .rt-card{transition:transform .35s cubic-bezier(.22,.68,0,1.2),box-shadow .35s ease;}
  .rt-card:hover{transform:translateY(-6px) scale(1.01);}
  .rt-icon{transition:transform .3s ease;}
  .rt-card:hover .rt-icon{animation:iconDance .6s ease both;}
  .rt-row{transition:transform .25s ease,box-shadow .25s ease;animation:rowSlide .5s ease both;}
  .rt-row:hover{transform:translateX(5px);box-shadow:0 4px 16px rgba(249,115,22,.1);}
  .tick-track-rt{animation:ticker 24s linear infinite;display:flex;width:max-content;}
  .tick-wrap-rt{overflow:hidden;}
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
  const cls = type === "flip" ? "rt-flip" : "rt-up";
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
    icon: RotateCcw,
    title: "Return Policy",
    color: "#f97316",
    grad: "from-orange-400 to-pink-400",
    content: (
      <div className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
        <p>
          We want you to be completely satisfied with your purchase. If you're
          not happy with your order, we accept returns within{" "}
          <strong className="text-gray-900 dark:text-white">30 days</strong> of
          delivery.
        </p>
        <p>
          Items must be unused, unopened, and in their original packaging to
          qualify for a full refund.
        </p>
      </div>
    ),
  },
  {
    icon: CheckCircle,
    title: "Eligible Items",
    color: "#22c55e",
    grad: "from-green-400 to-emerald-500",
    content: (
      <div className="space-y-3">
        {[
          {
            name: "Unopened Products",
            desc: "Items in original, sealed packaging are fully eligible for return.",
          },
          {
            name: "Damaged on Arrival",
            desc: "If your item arrived damaged, contact us within 48 hours with photos.",
          },
          {
            name: "Wrong Item Received",
            desc: "We'll cover all return shipping costs if we made an error.",
          },
        ].map((opt, i) => (
          <div
            key={i}
            className="rt-row p-3 sm:p-4 rounded-xl bg-green-50 dark:bg-gray-700/50"
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
    icon: XCircle,
    title: "Non-Eligible Items",
    color: "#ec4899",
    grad: "from-pink-400 to-rose-500",
    content: (
      <div className="space-y-3">
        {[
          {
            name: "Opened / Used Products",
            desc: "For hygiene reasons, opened skincare and body products cannot be returned.",
          },
          {
            name: "Items Past 30 Days",
            desc: "Returns requested after 30 days of delivery are not accepted.",
          },
          {
            name: "Sale / Clearance Items",
            desc: "Items purchased on sale or during promotions are final sale.",
          },
        ].map((opt, i) => (
          <div
            key={i}
            className="rt-row p-3 sm:p-4 rounded-xl bg-pink-50 dark:bg-gray-700/50"
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
    icon: Clock,
    title: "Refund Process",
    color: "#3b82f6",
    grad: "from-blue-400 to-blue-500",
    content: (
      <div className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
        <p>
          Once we receive and inspect your return, we'll notify you via email.
          Approved refunds are processed within{" "}
          <strong className="text-gray-900 dark:text-white">
            5–7 business days
          </strong>{" "}
          back to your original payment method.
        </p>
        <p>
          Shipping costs are non-refundable unless the return is due to our
          error.
        </p>
      </div>
    ),
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
    "\u2726 RETURNS",
    "\u2726 30-DAY POLICY",
    "\u2726 EASY REFUNDS",
    "\u2726 CUSTOMER CARE",
    "\u2726 HASSLE FREE",
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
        className="rt-blob hidden sm:block"
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
        className="rt-blob hidden sm:block"
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
          HASSLE-FREE
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
          <span className="rt-shimmer">Returns</span> &amp; Refunds
        </h1>
        <p
          className={`text-base sm:text-xl text-gray-600 rt-up ${ready ? "on" : ""}`}
          style={{ transitionDelay: "350ms" }}
        >
          Simple, transparent, and stress-free
        </p>
      </section>

      {/* Ticker */}
      <div
        className="tick-wrap-rt py-2.5 sm:py-3 mb-10 sm:mb-14"
        style={{
          background: "linear-gradient(90deg,#f97316,#ec4899)",
          borderTop: "2px solid #fbbf24",
          borderBottom: "2px solid #fbbf24",
        }}
      >
        <div className="tick-track-rt">
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
            <div className="rt-card bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
              <div
                className="rt-blob"
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
                  className={`rt-icon w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${sec.grad}`}
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
        <Reveal type="flip" delay={400}>
          <div
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg,#f97316 0%,#ec4899 100%)",
            }}
          >
            <div
              className="rt-blob"
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
              <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 mt-1" />
              <h2
                className="text-xl sm:text-2xl font-black"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                <WaveText text="Start a Return?" />
              </h2>
            </div>
            <p className="mb-2 text-white/90 relative z-10 text-sm sm:text-base">
              Ready to return an item or have questions? Reach out to us
              directly on WhatsApp!
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
