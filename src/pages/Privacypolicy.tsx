// src/pages/PrivacyPolicy.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Share2,
  Cookie,
  Mail,
  RefreshCw,
  UserCheck,
  Trash2,
} from "lucide-react";

const STYLES = `
  @keyframes heroTitle {
    0%   { opacity:0; transform:perspective(800px) rotateX(90deg) translateY(-40px); filter:blur(16px); }
    60%  { filter:blur(0); }
    100% { opacity:1; transform:perspective(800px) rotateX(0) translateY(0); }
  }
  @keyframes morphBlob {
    0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
    25%     { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; }
    50%     { border-radius:50% 60% 30% 40%/70% 30% 50% 60%; }
    75%     { border-radius:40% 30% 60% 70%/30% 70% 40% 50%; }
  }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);} }
  @keyframes badgePop { 0%{transform:scale(0) rotate(-20deg);opacity:0;}70%{transform:scale(1.2) rotate(5deg);}85%{transform:scale(.95) rotate(-2deg);}100%{transform:scale(1) rotate(0);opacity:1;} }
  @keyframes ticker   { from{transform:translateX(0);}to{transform:translateX(-50%);} }
  @keyframes cardFlip { 0%{transform:perspective(1000px) rotateY(-8deg) rotateX(4deg) scale(.92);opacity:0;}100%{transform:perspective(1000px) rotateY(0) rotateX(0) scale(1);opacity:1;} }
  @keyframes iconDance{ 0%,100%{transform:rotate(0) scale(1);}25%{transform:rotate(15deg) scale(1.1);}50%{transform:rotate(-5deg) scale(.95);}75%{transform:rotate(10deg) scale(1.05);} }
  @keyframes pulseRing{ 0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,.4);}50%{box-shadow:0 0 0 12px rgba(249,115,22,0);} }

  .pp-blob { position:absolute; pointer-events:none; animation:morphBlob 9s ease-in-out infinite; filter:blur(2px); }
  .ab-shimmer { background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .pp-reveal-up   { opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .pp-reveal-up.on { opacity:1; transform:translateY(0); }
  .pp-reveal-left { opacity:0; transform:translateX(-32px); transition:opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .pp-reveal-left.on { opacity:1; transform:translateX(0); }
  .pp-reveal-flip     { opacity:0; }
  .pp-reveal-flip.on  { animation:cardFlip .7s cubic-bezier(.22,.68,0,1.2) both; }
  .pp-card { transition:transform .35s cubic-bezier(.22,.68,0,1.2), box-shadow .35s ease; }
  .pp-card:hover { transform:translateY(-6px) scale(1.01); box-shadow:0 20px 48px rgba(249,115,22,.12)!important; }
  .pp-card:hover .pp-icon { animation:iconDance .6s ease both; }
  .pp-icon { transition:transform .3s ease; }
  .tick-track { animation:ticker 28s linear infinite; display:flex; width:max-content; }
  .tick-wrap  { overflow:hidden; }
  .toc-item { transition:all .2s ease; border-left:3px solid transparent; }
  .toc-item:hover { border-left-color:#f97316; background:rgba(249,115,22,.06); transform:translateX(4px); }
  .toc-item.active { border-left-color:#ec4899; background:rgba(236,72,153,.08); }
  .section-anchor { scroll-margin-top: 100px; }
  .pulse-ring { animation:pulseRing 2.5s ease-in-out infinite; }
  @media(hover:none){.pp-blob{display:none;}}
`;

function usePpStyles() {
  useEffect(() => {
    if (document.getElementById("pref-pp-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-pp-styles";
    s.textContent = STYLES;
    document.head.appendChild(s);
  }, []);
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const Reveal: React.FC<{ children: React.ReactNode; type?: "up"|"left"|"flip"; delay?: number; className?: string }> = ({
  children, type = "up", delay = 0, className = ""
}) => {
  const { ref, visible } = useInView();
  const cls = { up: "pp-reveal-up", left: "pp-reveal-left", flip: "pp-reveal-flip" }[type];
  return (
    <div ref={ref} className={`${cls} ${visible ? "on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, animationDelay: visible ? `${delay}ms` : undefined }}>
      {children}
    </div>
  );
};

type PrivacyPolicyProps = { onNavigate: (page: string) => void };

const SECTIONS = [
  { id: "information",  icon: Database,   color: "#f97316", title: "Information We Collect",        short: "What we collect" },
  { id: "usage",        icon: Eye,        color: "#ec4899", title: "How We Use Your Information",   short: "How we use it" },
  { id: "sharing",      icon: Share2,     color: "#fbbf24", title: "Sharing Your Information",      short: "Who we share with" },
  { id: "security",     icon: Lock,       color: "#84cc16", title: "Data Security",                 short: "How we protect you" },
  { id: "cookies",      icon: Cookie,     color: "#06b6d4", title: "Cookies & Tracking",            short: "Cookies policy" },
  { id: "rights",       icon: UserCheck,  color: "#a855f7", title: "Your Rights",                   short: "Your rights" },
  { id: "retention",    icon: Trash2,     color: "#f43f5e", title: "Data Retention",                short: "How long we keep data" },
  { id: "contact",      icon: Mail,       color: "#f97316", title: "Contact Us",                    short: "Get in touch" },
  { id: "updates",      icon: RefreshCw,  color: "#ec4899", title: "Policy Updates",                short: "Changes to policy" },
];

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
  usePpStyles();
  const [ready, setReady] = useState(false);
  const [activeSection, setActiveSection] = useState("information");

  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const ticks = ["✦ PRIVACY POLICY", "✦ DATA PROTECTION", "✦ YOUR RIGHTS", "✦ GDPR COMPLIANT", "✦ SECURE & SAFE", "✦ TRANSPARENT"];

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: "linear-gradient(135deg,#fff7ed 0%,#fce7f3 50%,#fef9c3 100%)" }}>
      <div className="pp-blob w-80 h-80 bg-orange-300 opacity-20 hidden sm:block" style={{ position: "absolute", top: "-60px", left: "-60px", animationDuration: "9s" }} />
      <div className="pp-blob w-60 h-60 bg-pink-300 opacity-15 hidden sm:block" style={{ position: "absolute", bottom: "60px", right: "-40px", animationDuration: "11s", animationDelay: "3s" }} />

      {/* Header */}
      <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 text-center z-10 px-4">
        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-xs sm:text-sm font-black mb-4 sm:mb-6"
          style={{ background: "linear-gradient(135deg,#f97316,#ec4899,#fbbf24)", animation: ready ? "badgePop .6s cubic-bezier(.22,.68,0,1.4) both" : "none", opacity: ready ? undefined : 0 }}>
          <Shield className="w-3.5 h-3.5" /> PRIVACY POLICY
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-3 sm:mb-4 leading-tight"
          style={{ fontFamily: "'Syne',sans-serif", animation: ready ? "heroTitle 1s cubic-bezier(.22,.68,0,1.2) .1s both" : "none", opacity: ready ? undefined : 0 }}>
          <span className="ab-shimmer">Your Privacy</span> Matters
        </h1>
        <p className={`text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto pp-reveal-up ${ready ? "on" : ""}`} style={{ transitionDelay: "350ms" }}>
          At <strong>PREFERABLE</strong>, we are committed to protecting your personal information and being transparent about how we use it.
        </p>
        <p className={`text-xs text-gray-400 mt-3 pp-reveal-up ${ready ? "on" : ""}`} style={{ transitionDelay: "450ms" }}>
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </section>

      {/* Ticker */}
      <div className="tick-wrap py-2.5 sm:py-3 mb-10 sm:mb-16" style={{ background: "linear-gradient(90deg,#f97316,#ec4899)", borderTop: "2px solid #fbbf24", borderBottom: "2px solid #fbbf24" }}>
        <div className="tick-track">
          {[...ticks, ...ticks].map((t, i) => <span key={i} className="text-white font-black text-xs sm:text-sm tracking-widest px-5 sm:px-8 flex-shrink-0">{t}</span>)}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Sticky Table of Contents */}
          <aside className="lg:w-72 flex-shrink-0">
            <Reveal type="left" delay={80}>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-xl lg:sticky lg:top-24">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Contents</h3>
                <nav className="space-y-1">
                  {SECTIONS.map((s, i) => (
                    <button key={s.id} onClick={() => scrollTo(s.id)}
                      className={`toc-item w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeSection === s.id ? "active" : ""}`}
                      style={{ animationDelay: `${i * 50}ms` }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}22` }}>
                        <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                      </div>
                      <span className={`text-xs font-bold ${activeSection === s.id ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>{s.short}</span>
                    </button>
                  ))}
                </nav>
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={() => onNavigate("contact")}
                    className="w-full py-2.5 text-white rounded-full font-black text-xs flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg,#f97316,#ec4899)" }}>
                    <Mail className="w-3.5 h-3.5" /> Privacy Questions?
                  </button>
                </div>
              </div>
            </Reveal>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6 sm:space-y-8">

            {/* Intro Card */}
            <Reveal type="flip" delay={100}>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="pp-blob w-40 h-40 bg-orange-200 opacity-20 -top-10 -right-10 hidden sm:block" style={{ animationDuration: "8s" }} />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 pulse-ring" style={{ background: "linear-gradient(135deg,#f97316,#ec4899)" }}>
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>
                      Our Commitment to <span className="ab-shimmer">You</span>
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      This Privacy Policy explains how <strong>PREFERABLE Global Cosmetics</strong> ("we", "our", or "us") collects, uses, and protects your personal information when you visit our website or purchase our products. By using our services, you agree to the practices described in this policy.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Section 1 — Information We Collect */}
            <Reveal delay={120}>
              <div id="information" className="section-anchor pp-card bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <SectionHeader icon={Database} color="#f97316" title="1. Information We Collect" />
                <div className="space-y-4 mt-5">
                  <SubSection title="Information You Provide">
                    <ul className="space-y-2">
                      {["Full name, email address, phone number, and shipping address when you place an order", "Account credentials (email and password) when you register", "Payment information processed securely through Paystack — we do not store your card details", "Messages and feedback when you contact our support team"].map((item, i) => <Li key={i}>{item}</Li>)}
                    </ul>
                  </SubSection>
                  <SubSection title="Information Collected Automatically">
                    <ul className="space-y-2">
                      {["Browser type, IP address, and device information", "Pages visited, time spent, and referring URLs", "Cookie identifiers and session data"].map((item, i) => <Li key={i}>{item}</Li>)}
                    </ul>
                  </SubSection>
                </div>
              </div>
            </Reveal>

            {/* Section 2 — How We Use */}
            <Reveal delay={140}>
              <div id="usage" className="section-anchor pp-card bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <SectionHeader icon={Eye} color="#ec4899" title="2. How We Use Your Information" />
                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                  {[
                    { title: "Order Fulfillment",    desc: "Processing payments, shipping products, and sending order confirmations and updates" },
                    { title: "Customer Support",     desc: "Responding to your questions, resolving issues, and improving our service" },
                    { title: "Account Management",   desc: "Creating and maintaining your account, managing preferences and order history" },
                    { title: "Marketing",            desc: "Sending promotional emails and offers — only with your explicit consent, and you may opt out anytime" },
                    { title: "Legal Compliance",     desc: "Meeting our legal obligations, preventing fraud, and enforcing our terms of service" },
                    { title: "Product Improvement",  desc: "Analyzing usage patterns to improve our website and product offerings" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700" style={{ background: "#ec489908" }}>
                      <p className="font-black text-sm text-gray-900 dark:text-white mb-1">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Section 3 — Sharing */}
            <Reveal delay={140}>
              <div id="sharing" className="section-anchor pp-card bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <SectionHeader icon={Share2} color="#fbbf24" title="3. Sharing Your Information" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 mb-4 leading-relaxed">
                  We <strong>never sell your personal data</strong>. We may share it only in these limited circumstances:
                </p>
                <div className="space-y-3">
                  {[
                    { party: "Payment Processors",   detail: "Paystack handles all payment transactions. Your card details go directly to them and are never stored on our servers." },
                    { party: "Delivery Partners",    detail: "We share your name and address with logistics companies to fulfil your orders." },
                    { party: "Legal Authorities",    detail: "When required by law, court order, or to protect the safety of our users." },
                    { party: "Business Transfers",   detail: "In the event of a merger or acquisition, your data may transfer to the new entity under the same privacy protections." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: "#fbbf2408" }}>
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#fbbf24" }} />
                      <div>
                        <span className="font-black text-sm text-gray-900 dark:text-white">{item.party}: </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Section 4 — Security */}
            <Reveal delay={140}>
              <div id="security" className="section-anchor pp-card bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="pp-blob w-32 h-32 bg-green-200 opacity-20 -bottom-8 -right-8 hidden sm:block" style={{ animationDuration: "7s" }} />
                <SectionHeader icon={Lock} color="#84cc16" title="4. Data Security" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 mb-4 leading-relaxed">
                  We implement industry-standard security measures to protect your information:
                </p>
                <div className="grid sm:grid-cols-3 gap-3 relative z-10">
                  {[
                    { label: "SSL Encryption",       desc: "All data transmitted between your browser and our servers is encrypted via HTTPS" },
                    { label: "Secure Payments",      desc: "Payments processed by Paystack with PCI-DSS Level 1 compliance" },
                    { label: "Access Controls",      desc: "Strict internal access controls — only authorized staff can access your data" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl text-center" style={{ background: "#84cc1612", border: "1px solid #84cc1630" }}>
                      <p className="font-black text-sm text-gray-900 dark:text-white mb-1">{item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4 italic">While we take strong precautions, no method of internet transmission is 100% secure. We encourage you to use a strong password and keep your login credentials private.</p>
              </div>
            </Reveal>

            {/* Section 5 — Cookies */}
            <Reveal delay={140}>
              <div id="cookies" className="section-anchor pp-card bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <SectionHeader icon={Cookie} color="#06b6d4" title="5. Cookies & Tracking" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 mb-4 leading-relaxed">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <div className="space-y-3">
                  {[
                    { type: "Essential Cookies",     color: "#06b6d4", desc: "Required for the website to function — shopping cart, login sessions, and checkout." },
                    { type: "Analytics Cookies",     color: "#f97316", desc: "Help us understand how visitors use our site so we can improve it. Data is anonymised." },
                    { type: "Marketing Cookies",     color: "#ec4899", desc: "Used to show you relevant ads and offers. You can opt out at any time via your browser settings." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: item.color }} />
                      <div>
                        <p className="font-black text-sm text-gray-900 dark:text-white">{item.type}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">You can disable cookies in your browser settings. Note that disabling essential cookies may affect site functionality.</p>
              </div>
            </Reveal>

            {/* Section 6 — Your Rights */}
            <Reveal delay={140}>
              <div id="rights" className="section-anchor pp-card bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="pp-blob w-36 h-36 bg-purple-200 opacity-15 -top-8 -right-8 hidden sm:block" style={{ animationDuration: "9s" }} />
                <SectionHeader icon={UserCheck} color="#a855f7" title="6. Your Rights" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 mb-5 leading-relaxed">
                  You have full control over your personal data. At any time, you may:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 relative z-10">
                  {[
                    { right: "Access",      desc: "Request a copy of all personal data we hold about you" },
                    { right: "Correct",     desc: "Ask us to correct any inaccurate or incomplete information" },
                    { right: "Delete",      desc: "Request deletion of your personal data (subject to legal obligations)" },
                    { right: "Restrict",    desc: "Ask us to limit how we process your data" },
                    { right: "Portability", desc: "Receive your data in a machine-readable format" },
                    { right: "Opt-out",     desc: "Unsubscribe from marketing emails at any time via the link in any email" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: "#a855f710", border: "1px solid #a855f720" }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black text-white" style={{ background: "#a855f7" }}>{item.right[0]}</div>
                      <div>
                        <p className="font-black text-sm text-gray-900 dark:text-white">{item.right}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-5">To exercise any of these rights, contact us at <a href="mailto:tsmglobalcosmetic@gmail.com" className="font-bold" style={{ color: "#a855f7" }}>tsmglobalcosmetic@gmail.com</a>. We will respond within 30 days.</p>
              </div>
            </Reveal>

            {/* Section 7 — Retention */}
            <Reveal delay={140}>
              <div id="retention" className="section-anchor pp-card bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <SectionHeader icon={Trash2} color="#f43f5e" title="7. Data Retention" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                  We retain your personal data only as long as necessary for the purposes outlined in this policy:
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    { type: "Account Data",     period: "Until account deletion",   detail: "Deleted within 30 days of account deletion request" },
                    { type: "Order History",    period: "7 years",                  detail: "Required for tax and legal compliance under Nigerian financial regulations" },
                    { type: "Support Records",  period: "2 years",                  detail: "Retained to resolve future disputes and improve customer service" },
                    { type: "Marketing Data",   period: "Until opt-out",            detail: "Removed from marketing lists within 10 business days of unsubscribe" },
                    { type: "Analytics Data",   period: "26 months",                detail: "Anonymised after 90 days; aggregate data may be kept indefinitely" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                      <span className="font-black text-sm text-gray-900 dark:text-white w-36 flex-shrink-0">{item.type}</span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-black text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#f43f5e,#ec4899)" }}>{item.period}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Section 8 — Contact */}
            <Reveal delay={140}>
              <div id="contact" className="section-anchor pp-card bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="pp-blob w-40 h-40 bg-orange-200 opacity-20 -bottom-10 -left-10 hidden sm:block" style={{ animationDuration: "10s" }} />
                <SectionHeader icon={Mail} color="#f97316" title="8. Contact Us" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 mb-5 leading-relaxed">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out:
                </p>
                <div className="grid sm:grid-cols-3 gap-3 relative z-10">
                  {[
                    { label: "Email",    value: "tsmglobalcosmetic@gmail.com",     href: "mailto:tsmglobalcosmetic@gmail.com" },
                    { label: "Phone",    value: "(+234) 080 6703 0009",             href: "tel:+2348067030009" },
                    { label: "Address",  value: "23/24 (CAT) Borno Plaza, Trade Fair, Lagos", href: null },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl" style={{ background: "#f9731610", border: "1px solid #f9731625" }}>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-bold break-words" style={{ color: "#f97316" }}>{item.value}</a>
                      ) : (
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">We aim to respond to all privacy-related inquiries within <strong>30 business days</strong>.</p>
              </div>
            </Reveal>

            {/* Section 9 — Updates */}
            <Reveal delay={140}>
              <div id="updates" className="section-anchor pp-card bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <SectionHeader icon={RefreshCw} color="#ec4899" title="9. Policy Updates" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. When we make significant changes, we will:
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "Update the 'Last updated' date at the top of this page",
                    "Send an email notification to registered users for material changes",
                    "Display a prominent notice on our website for 30 days after the change",
                  ].map((item, i) => <Li key={i}>{item}</Li>)}
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                  Continued use of our services after a policy update constitutes acceptance of the revised policy. We encourage you to review this page periodically.
                </p>
              </div>
            </Reveal>

            {/* Footer CTA */}
            <Reveal type="flip" delay={100}>
              <div className="rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,#f97316,#ec4899)" }}>
                <div className="pp-blob w-32 h-32 bg-white opacity-10 -top-8 -left-8" style={{ animationDuration: "6s" }} />
                <div className="pp-blob w-24 h-24 bg-white opacity-10 -bottom-6 -right-6" style={{ animationDuration: "8s" }} />
                <Shield className="w-10 h-10 text-white mx-auto mb-3 relative z-10" />
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 relative z-10" style={{ fontFamily: "'Syne',sans-serif" }}>
                  We Take Your Privacy Seriously
                </h3>
                <p className="text-white/80 text-sm mb-5 relative z-10">Questions about your data? Our team is happy to help.</p>
                <button onClick={() => onNavigate("contact")}
                  className="px-6 sm:px-8 py-3 bg-white font-black text-sm rounded-full relative z-10"
                  style={{ color: "#f97316" }}>
                  ✦ Contact Our Team
                </button>
              </div>
            </Reveal>

          </main>
        </div>
      </div>
    </div>
  );
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ icon: React.ElementType; color: string; title: string }> = ({ icon: Icon, color, title }) => (
  <div className="flex items-center gap-3">
    <div className="pp-icon w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}22` }}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
    </div>
    <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Syne',sans-serif" }}>{title}</h2>
  </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="text-sm font-black text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#f97316" }} />{title}
    </h4>
    {children}
  </div>
);

const Li: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "#f97316" }} />
    {children}
  </li>
);