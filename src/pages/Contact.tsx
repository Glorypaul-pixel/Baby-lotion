import React, { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

const CONTACT_STYLES = `
  @keyframes heroTitle { 0%{opacity:0;transform:perspective(800px) rotateX(90deg) translateY(-40px);filter:blur(16px);}60%{filter:blur(0);}100%{opacity:1;transform:perspective(800px) rotateX(0) translateY(0);} }
  @keyframes cardFlip { 0%{transform:perspective(1000px) rotateY(-8deg) rotateX(4deg) scale(.92);opacity:0;}100%{transform:perspective(1000px) rotateY(0) rotateX(0) scale(1);opacity:1;} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);} }
  @keyframes morphBlob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;}50%{border-radius:50% 60% 30% 40%/70% 30% 50% 60%;}75%{border-radius:40% 30% 60% 70%/30% 70% 40% 50%;} }
  @keyframes badgePop { 0%{transform:scale(0) rotate(-20deg);opacity:0;}70%{transform:scale(1.2) rotate(5deg);}85%{transform:scale(.95) rotate(-2deg);}100%{transform:scale(1) rotate(0);opacity:1;} }
  @keyframes iconDance { 0%,100%{transform:rotate(0) scale(1);}25%{transform:rotate(15deg) scale(1.1);}50%{transform:rotate(-5deg) scale(.95);}75%{transform:rotate(10deg) scale(1.05);} }
  @keyframes ticker { from{transform:translateX(0);}to{transform:translateX(-50%);} }
  @keyframes spinLoader { to{transform:rotate(360deg);} }

  .ct-blob { position:absolute; pointer-events:none; animation:morphBlob 9s ease-in-out infinite; filter:blur(2px); }
  .ab-shimmer { background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .ct-reveal-up   { opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .ct-reveal-up.on { opacity:1; transform:translateY(0); }
  .ct-reveal-left { opacity:0; transform:translateX(-32px); transition:opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .ct-reveal-left.on { opacity:1; transform:translateX(0); }
  .ct-reveal-flip     { opacity:0; }
  .ct-reveal-flip.on  { animation:cardFlip .7s cubic-bezier(.22,.68,0,1.2) both; }
  .ct-card { transition:transform .35s cubic-bezier(.22,.68,0,1.2), box-shadow .35s ease; }
  .ct-card:hover { transform:translateY(-8px) scale(1.02); box-shadow:0 24px 48px rgba(249,115,22,.15)!important; }
  .ct-icon { transition:transform .3s cubic-bezier(.22,.68,0,1.2); }
  .ct-card:hover .ct-icon { animation:iconDance .6s ease both; }
  .ct-field { transition:border-color .25s ease, box-shadow .25s ease, transform .25s ease; }
  .ct-field:focus { border-color:#f97316!important; box-shadow:0 0 0 4px rgba(249,115,22,.18); transform:scale(1.012); outline:none; }
  .send-btn { transition:transform .2s ease, box-shadow .2s ease; position:relative; overflow:hidden; }
  .send-btn:not(:disabled):hover { transform:scale(1.03); box-shadow:0 16px 40px rgba(249,115,22,.4); }
  .send-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.3) 50%,transparent 60%); transform:translateX(-100%); transition:transform .55s ease; }
  .send-btn:not(:disabled):hover::after { transform:translateX(100%); }
  .ct-ticker-track { animation:ticker 22s linear infinite; display:flex; width:max-content; }
  .ct-ticker-wrap  { overflow:hidden; }
  .spin-loader { width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spinLoader .7s linear infinite;display:inline-block; }
  @media(hover:none){.ct-blob{display:none;}}
`;

function useCtStyles() {
  useEffect(() => {
    if (document.getElementById("pref-ct-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-ct-styles";
    s.textContent = CONTACT_STYLES;
    document.head.appendChild(s);
  }, []);
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const Reveal: React.FC<{ children: React.ReactNode; type?: "up"|"left"|"flip"; delay?: number; className?: string }> = ({
  children, type="up", delay=0, className=""
}) => {
  const { ref, visible } = useInView();
  const cls = { up:"ct-reveal-up", left:"ct-reveal-left", flip:"ct-reveal-flip" }[type];
  return (
    <div ref={ref} className={`${cls} ${visible?"on":""} ${className}`}
      style={{ transitionDelay:`${delay}ms`, animationDelay: visible?`${delay}ms`:undefined }}>
      {children}
    </div>
  );
};

type ContactForm = { name:string; email:string; subject:string; message:string };

export const Contact: React.FC = () => {
  useCtStyles();
  const [formData, setFormData] = useState<ContactForm>({ name:"", email:"", subject:"", message:"" });
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      toast.success("✨ Message sent! We'll get back to you soon.");
      setFormData({ name:"", email:"", subject:"", message:"" });
    } catch { toast.error("Something went wrong. Please try again."); }
    finally  { setSubmitting(false); }
  };

  const contactItems = [
    { icon:MapPin, title:"Visit Us",   content:"23/24 (CAT) Borno Plaza\nTrade Fair, Lagos", color:"#3b82f6", grad:"from-blue-400 to-blue-500" },
    { icon:Phone,  title:"Call Us",    content:"(+234) 080 6703 0009\nMon-Fri 8am-5pm",     color:"#22c55e", grad:"from-green-400 to-green-500" },
    { icon:Mail,   title:"Email Us",   content:"tsmglobalcosmetic@gmail.com\nReply within 24 hours", color:"#f97316", grad:"from-orange-400 to-pink-400" },
  ];

  const tickerItems = ["✦ GET IN TOUCH", "✦ WE'RE HERE TO HELP", "✦ 24HR RESPONSE", "✦ CUSTOMER CARE", "✦ REACH OUT TODAY"];

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:"linear-gradient(135deg,#fff7ed 0%,#fce7f3 50%,#fef9c3 100%)" }}>
      <div className="ct-blob w-80 h-80 bg-orange-300 opacity-20 top-[-60px] left-[-60px] hidden sm:block" style={{ animationDuration:"9s" }} />
      <div className="ct-blob w-64 h-64 bg-pink-300 opacity-15 bottom-10 right-[-40px] hidden sm:block" style={{ animationDuration:"11s", animationDelay:"3s" }} />

      {/* Header */}
      <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 text-center z-10 px-4">
        <div className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-xs sm:text-sm font-black mb-4 sm:mb-6"
          style={{ background:"linear-gradient(135deg,#f97316,#ec4899,#fbbf24)", animation: ready?"badgePop .6s cubic-bezier(.22,.68,0,1.4) both":"none", opacity: ready?undefined:0 }}>
          ✦ CONTACT US ✦
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-3 sm:mb-4 leading-tight"
          style={{ fontFamily:"'Syne',sans-serif", animation: ready?"heroTitle 1s cubic-bezier(.22,.68,0,1.2) .1s both":"none", opacity: ready?undefined:0 }}>
          <span className="ab-shimmer">Get in</span> Touch
        </h1>
        <p className={`text-base sm:text-xl text-gray-600 dark:text-gray-400 ct-reveal-up ${ready?"on":""}`} style={{ transitionDelay:"350ms" }}>
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </section>

      {/* Ticker */}
      <div className="ct-ticker-wrap py-2.5 sm:py-3 mb-10 sm:mb-16" style={{ background:"linear-gradient(90deg,#f97316,#ec4899)", borderTop:"2px solid #fbbf24", borderBottom:"2px solid #fbbf24" }}>
        <div className="ct-ticker-track">
          {[...tickerItems,...tickerItems].map((item,i) => (
            <span key={i} className="text-white font-black text-xs sm:text-sm tracking-widest px-5 sm:px-8 flex-shrink-0">{item}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Form */}
          <Reveal type="left" delay={80} className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="ct-blob w-40 h-40 bg-orange-200 opacity-20 -top-10 -right-10 hidden sm:block" style={{ animationDuration:"8s" }} />
              <h2 className="text-xl sm:text-2xl font-black mb-5 sm:mb-6 text-gray-900 dark:text-white relative z-10" style={{ fontFamily:"'Syne',sans-serif" }}>
                Send Us a <span className="ab-shimmer">Message</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {[{ key:"name", label:"Your Name", type:"text" }, { key:"email", label:"Your Email", type:"email" }].map(({ key, label, type }, i) => (
                    <div key={key} style={{ animation:`fadeUp .5s ease ${i*80}ms both` }}>
                      <label className="block text-xs sm:text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>
                      <input type={type} required placeholder={label}
                        value={(formData as Record<string,string>)[key]}
                        onChange={e => setFormData({ ...formData, [key]:e.target.value })}
                        className="ct-field w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium text-sm" />
                    </div>
                  ))}
                </div>
                <div style={{ animation:"fadeUp .5s ease 160ms both" }}>
                  <label className="block text-xs sm:text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">Subject</label>
                  <input type="text" required placeholder="How can we help?" value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject:e.target.value })}
                    className="ct-field w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium text-sm" />
                </div>
                <div style={{ animation:"fadeUp .5s ease 240ms both" }}>
                  <label className="block text-xs sm:text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">Message</label>
                  <textarea required rows={5} placeholder="Tell us more about your inquiry..."
                    value={formData.message} onChange={e => setFormData({ ...formData, message:e.target.value })}
                    className="ct-field w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium resize-none text-sm" />
                </div>
                <button type="submit" disabled={submitting}
                  className="send-btn w-full py-3.5 sm:py-4 text-white rounded-full font-black text-base sm:text-lg flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background:"linear-gradient(135deg,#f97316,#ec4899)" }}>
                  {submitting ? <><span className="spin-loader" /> Sending...</> : <><Send className="w-4 h-4 sm:w-5 sm:h-5" /> Send Message</>}
                </button>
              </form>
            </div>
          </Reveal>

          {/* Contact cards */}
          <div className="space-y-4 sm:space-y-5">
            {contactItems.map((item, i) => (
              <Reveal key={i} type="flip" delay={i * 140}>
                <div className="ct-card group bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-lg relative overflow-hidden">
                  <div className="ct-blob w-24 h-24 opacity-10 -top-6 -right-6 hidden sm:block" style={{ background:item.color, animationDuration:"6s", animationDelay:`${i*.5}s` }} />
                  <div className={`ct-icon w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${item.grad} rounded-xl flex items-center justify-center mb-3 sm:mb-4 relative z-10`}>
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-1 relative z-10" style={{ fontFamily:"'Syne',sans-serif" }}>{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line text-xs sm:text-sm relative z-10 leading-relaxed break-words">{item.content}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};