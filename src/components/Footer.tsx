import React, { useEffect, useState } from "react";
import {
  Baby,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const STYLES = `
  @keyframes morphBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;}50%{border-radius:50% 60% 30% 40%/70% 30% 50% 60%;}75%{border-radius:40% 30% 60% 70%/30% 70% 40% 50%;}}
  @keyframes floatY{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-6px) rotate(2deg);}}
  @keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes iconBounce{0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}
  .ft-blob{position:absolute;pointer-events:none;animation:morphBlob 9s ease-in-out infinite;filter:blur(2px);}
  .ab-shimmer{background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .ft-logo{animation:floatY 4s ease-in-out infinite;}
  .ft-link{transition:color .2s ease,transform .2s ease;display:inline-block;}
  .ft-link:hover{color:#f97316!important;transform:translateX(4px);}
  .social-btn{transition:transform .2s cubic-bezier(.22,.68,0,1.4),box-shadow .2s ease;}
  .social-btn:hover{transform:scale(1.2) rotate(-5deg);box-shadow:0 8px 20px rgba(249,115,22,.3);}
  .social-btn:hover svg{animation:iconBounce .4s ease both;}
  .tick-track{animation:ticker 28s linear infinite;display:flex;width:max-content;}
  .tick-wrap{overflow:hidden;}
  .ft-divider{background:linear-gradient(90deg,transparent,#f97316,#ec4899,transparent);height:1px;border:none;}
`;

function useStyles() {
  useEffect(() => {
    if (document.getElementById("pref-ft-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-ft-styles";
    s.textContent = STYLES;
    document.head.appendChild(s);
  }, []);
}

type FooterProps = { onNavigate: (page: string) => void };

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  useStyles();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const ticks = [
    "\u2726 PREFERABLE",
    "\u2726 BABY CARE",
    "\u2726 100% NATURAL",
    "\u2726 MADE WITH LOVE",
    "\u2726 DERMATOLOGIST TESTED",
    "\u2726 ECO-FRIENDLY",
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        background:
          "linear-gradient(135deg,#fff7ed 0%,#fce7f3 50%,#fef9c3 100%)",
      }}
    >
      <div
        className="ft-blob w-64 h-64 bg-orange-300 opacity-15"
        style={{
          position: "absolute",
          top: "-40px",
          left: "-40px",
          animationDuration: "10s",
        }}
      />
      <div
        className="ft-blob w-48 h-48 bg-pink-300 opacity-10"
        style={{
          position: "absolute",
          bottom: "0",
          right: "-30px",
          animationDuration: "12s",
          animationDelay: "3s",
        }}
      />

      <div
        className="tick-wrap py-2.5 relative z-10"
        style={{
          background: "linear-gradient(90deg,#f97316,#ec4899)",
          borderBottom: "2px solid #fbbf24",
        }}
      >
        <div className="tick-track">
          {[...ticks, ...ticks].map((t, i) => (
            <span
              key={i}
              className="text-white font-black text-xs tracking-widest px-6 flex-shrink-0"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div
            className="space-y-5"
            style={{ animation: visible ? "fadeUp .7s ease .1s both" : "none" }}
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onNavigate("home")}
            >
              <div className="ft-logo relative">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#f97316,#ec4899)",
                  }}
                >
                  <Baby className="w-6 h-6 text-white" />
                </div>
              </div>
              {/* ✅ Fixed: PREFERRABLE → PREFERABLE */}
              <span
                className="text-xl font-black ab-shimmer"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                PREFERABLE
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Gentle care for your little ones. Premium baby care products made
              with love and natural ingredients.
            </p>
            <div className="flex gap-3">
              {[
                {
                  href: "https://facebook.com",
                  Icon: Facebook,
                  color: "#1877f2",
                },
                {
                  href: "https://instagram.com",
                  Icon: Instagram,
                  color: "#e4405f",
                },
                {
                  href: "https://twitter.com",
                  Icon: Twitter,
                  color: "#1da1f2",
                },
              ].map(({ href, Icon, color }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: `${color}18`,
                    border: `1.5px solid ${color}33`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div
            style={{ animation: visible ? "fadeUp .7s ease .2s both" : "none" }}
          >
            <h3
              className="font-black text-gray-900 dark:text-white mb-5 text-sm uppercase tracking-widest"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {["Home", "Products", "About", "Blog", "Contact"].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => onNavigate(link.toLowerCase())}
                    className="ft-link text-gray-600 dark:text-gray-400 text-sm font-medium"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div
            style={{ animation: visible ? "fadeUp .7s ease .3s both" : "none" }}
          >
            <h3
              className="font-black text-gray-900 dark:text-white mb-5 text-sm uppercase tracking-widest"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Shipping Info", page: "shipping" },
                { label: "Returns & Exchanges", page: "returns" },
                { label: "FAQ", page: "faq" },
                { label: "Privacy Policy", page: "privacy" },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    onClick={() => onNavigate(page)}
                    className="ft-link text-gray-600 dark:text-gray-400 text-sm font-medium"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div
            style={{ animation: visible ? "fadeUp .7s ease .4s both" : "none" }}
          >
            <h3
              className="font-black text-gray-900 dark:text-white mb-5 text-sm uppercase tracking-widest"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              Contact Us
            </h3>
            <ul className="space-y-3">
              {[
                {
                  Icon: MapPin,
                  text: "(23/24 CAT) Borno Plaza, Trade Fair, Lagos, Nigeria",
                },
                { Icon: Phone, text: "(+234) 080-6703-0009" },
                { Icon: Mail, text: "tsmglobalcosmetic@gmail.com" },
              ].map(({ Icon, text }, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm"
                >
                  <Icon
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#f97316" }}
                  />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="ft-divider mt-10 mb-6" />
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium">
          &copy; 2026 <span className="ab-shimmer font-black">PREFERABLE</span>.
          All rights reserved.
        </div>
      </div>
    </footer>
  );
};
