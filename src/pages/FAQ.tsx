import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Mail, Phone } from "lucide-react";

const FAQ_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
  @keyframes heroTitle { 0%{opacity:0;transform:perspective(800px) rotateX(90deg) translateY(-40px);filter:blur(16px);}60%{filter:blur(0);}100%{opacity:1;transform:perspective(800px) rotateX(0) translateY(0);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);} }
  @keyframes morphBlob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;}50%{border-radius:50% 60% 30% 40%/70% 30% 50% 60%;}75%{border-radius:40% 30% 60% 70%/30% 70% 40% 50%;} }
  @keyframes badgePop { 0%{transform:scale(0) rotate(-20deg);opacity:0;}70%{transform:scale(1.2) rotate(5deg);}85%{transform:scale(.95) rotate(-2deg);}100%{transform:scale(1) rotate(0);opacity:1;} }
  @keyframes answerReveal { from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);} }
  @keyframes ticker { from{transform:translateX(0);}to{transform:translateX(-50%);} }
  @keyframes waveText { 0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);} }
  @keyframes numberPop { 0%{transform:scale(0) rotate(-10deg);opacity:0;}70%{transform:scale(1.15);}100%{transform:scale(1);opacity:1;} }

  .faq-blob { position:absolute; pointer-events:none; animation:morphBlob 9s ease-in-out infinite; filter:blur(2px); }
  .ab-shimmer { background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .faq-reveal-up   { opacity:0; transform:translateY(20px); transition:opacity .55s ease, transform .55s cubic-bezier(.22,.68,0,1.2); }
  .faq-reveal-up.on { opacity:1; transform:translateY(0); }
  .faq-item { transition:box-shadow .3s ease, transform .3s ease; }
  .faq-item:hover { box-shadow:0 12px 32px rgba(249,115,22,.12); }
  .faq-q { transition:background .2s ease; }
  .faq-q:hover { background:rgba(249,115,22,.06)!important; }
  .faq-answer { animation:answerReveal .35s cubic-bezier(.22,.68,0,1.2) both; }
  .faq-chevron { transition:transform .35s cubic-bezier(.22,.68,0,1.4); }
  .faq-chevron.open { transform:rotate(180deg) scale(1.1); }
  .faq-num { animation:numberPop .5s cubic-bezier(.22,.68,0,1.4) both; }
  .cta-btn { transition:transform .2s ease, box-shadow .2s ease; position:relative; overflow:hidden; display:inline-flex; align-items:center; }
  .cta-btn:hover { transform:scale(1.05); }
  .cta-btn::after { content:""; position:absolute; inset:0; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.25) 50%,transparent 60%); transform:translateX(-100%); transition:transform .5s ease; }
  .cta-btn:hover::after { transform:translateX(100%); }
  .wave-char { display:inline-block; }
  .faq-ticker-track { animation:ticker 24s linear infinite; display:flex; width:max-content; }
  .faq-ticker-wrap  { overflow:hidden; }
`;

function useFaqStyles() {
  useEffect(() => {
    if (document.getElementById("pref-faq-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-faq-styles";
    s.textContent = FAQ_STYLES;
    document.head.appendChild(s);
  }, []);
}

function useInView(threshold = 0.1) {
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

const Reveal: React.FC<{ children:React.ReactNode; delay?:number; className?:string }> = ({ children, delay=0, className="" }) => {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`faq-reveal-up ${visible?"on":""} ${className}`} style={{ transitionDelay:`${delay}ms` }}>
      {children}
    </div>
  );
};

const WaveText: React.FC<{ text:string; className?:string }> = ({ text, className="" }) => (
  <span className={className}>
    {text.split("").map((ch,i) => (
      <span key={i} className="wave-char" style={{ animation:`waveText 1.6s ease-in-out ${i*75}ms infinite` }}>
        {ch===" "?"\u00A0":ch}
      </span>
    ))}
  </span>
);

const faqs = [
  { q:"Are Preferable products safe for newborns?", a:"Yes! All our products are specifically formulated for delicate baby skin and are safe from day one. They are dermatologist-tested, hypoallergenic, and free from harsh chemicals, parabens, and artificial fragrances." },
  { q:"Can adults use baby lotion?", a:"Absolutely! Our baby lotions are gentle and moisturizing for all skin types and ages. Many adults prefer baby products for their sensitive skin or simply enjoy the gentle, light fragrance." },
  { q:"What makes Preferable products different?", a:"We use only premium natural ingredients, avoid harsh chemicals, and conduct rigorous testing. Every product is made with the same care we would use for our own children." },
  { q:"How should I store Preferable products?", a:"Store products in a cool, dry place away from direct sunlight. Keep containers tightly closed when not in use. Products have a shelf life of 12-24 months unopened." },
  { q:"Do you test on animals?", a:"No, we never test on animals. We are committed to cruelty-free practices and use alternative testing methods to ensure safety and effectiveness." },
  { q:"What if my baby has a reaction to a product?", a:"If your baby experiences any reaction, discontinue use immediately and consult your pediatrician. Contact us for a full refund." },
  { q:"Are your products organic?", a:"Many of our ingredients are organic and all are natural. We source the highest quality ingredients and clearly list all components on our packaging." },
  { q:"How long does shipping take?", a:"Standard shipping is FREE and takes 3-5 business days. Express (1-2 days) and Next Day shipping options are also available." },
  { q:"What is your return policy?", a:"We offer a 30-day money-back guarantee. If you are not satisfied, return it within 30 days for a full refund. Items must be unused and in original packaging." },
  { q:"Do you offer subscriptions?", a:"Yes! Subscribe to your favorite products and save 15%. You can adjust delivery frequency, skip shipments, or cancel anytime." },
  { q:"Are your products fragrance-free?", a:"We offer both fragranced and fragrance-free options. Our fragranced products use only natural, gentle scents." },
  { q:"Can I use Preferable products if my baby has eczema?", a:"Our Sensitive Skin Baby Lotion is formulated for babies with eczema and sensitive skin. We recommend consulting with your pediatrician before using new products on babies with skin conditions." },
];

export const FAQ: React.FC = () => {
  useFaqStyles();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  const tickerItems = ["FREQUENTLY ASKED", "GOT QUESTIONS?", "WE HAVE ANSWERS", "BABY CARE FAQ", "NEED HELP?"];

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:"linear-gradient(135deg,#fff7ed 0%,#fce7f3 50%,#fef9c3 100%)" }}>
      <div className="faq-blob w-80 h-80 bg-orange-300 opacity-20 top-0 left-0 -translate-x-1/4 -translate-y-1/4" style={{ animationDuration:"9s" }} />
      <div className="faq-blob w-60 h-60 bg-pink-300 opacity-15 bottom-20 right-0 translate-x-1/4" style={{ animationDuration:"11s", animationDelay:"3s" }} />

      <section className="relative pt-28 pb-12 text-center z-10">
        <div className="inline-block px-5 py-2.5 rounded-full text-white text-sm font-black mb-6"
          style={{ background:"linear-gradient(135deg,#f97316,#ec4899,#fbbf24)", animation: ready?"badgePop .6s cubic-bezier(.22,.68,0,1.4) both":"none", opacity: ready?undefined:0 }}>
          FAQ
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight"
          style={{ fontFamily:"'Nunito', sans-serif", animation: ready?"heroTitle 1s cubic-bezier(.22,.68,0,1.2) .1s both":"none", opacity: ready?undefined:0 }}>
          <span className="ab-shimmer">Frequently</span> Asked
        </h1>
        <p className={`text-xl text-gray-600 faq-reveal-up ${ready?"on":""}`} style={{ transitionDelay:"350ms" }}>
          Everything you need to know about Preferable
        </p>
      </section>

      <div className="faq-ticker-wrap py-3 mb-16" style={{ background:"linear-gradient(90deg,#f97316,#ec4899)", borderTop:"2px solid #fbbf24", borderBottom:"2px solid #fbbf24" }}>
        <div className="faq-ticker-track">
          {[...tickerItems,...tickerItems].map((item,i) => (
            <span key={i} className="text-white font-black text-sm tracking-widest px-8 flex-shrink-0">{item}</span>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Reveal key={index} delay={index * 40}>
              <div className="faq-item bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="faq-q w-full px-7 py-5 flex items-center justify-between text-left rounded-2xl"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="faq-num w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-black"
                      style={{ background:"linear-gradient(135deg,#f97316,#ec4899)", animationDelay:`${index*40}ms` }}>
                      {index + 1}
                    </span>
                    <span className="font-black text-gray-900 dark:text-white pr-4">{faq.q}</span>
                  </div>
                  <ChevronDown className={`faq-chevron w-5 h-5 flex-shrink-0 ${openIndex === index ? "open" : ""}`} style={{ color:"#f97316" }} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96" : "max-h-0"}`}>
                  {openIndex === index && (
                    <div className="faq-answer px-7 pb-6">
                      <div className="w-full h-px mb-4" style={{ background:"linear-gradient(90deg,#f97316,#ec4899,transparent)" }} />
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-14">
          <div className="rounded-3xl p-10 text-white text-center relative overflow-hidden"
            style={{ background:"linear-gradient(135deg,#f97316 0%,#ec4899 100%)" }}>
            <div className="faq-blob w-40 h-40 bg-white opacity-10 top-0 left-0 -translate-x-1/4 -translate-y-1/4" style={{ animationDuration:"7s" }} />
            <h2 className="text-3xl font-black mb-3 relative z-10" style={{ fontFamily:"'Nunito', sans-serif" }}>
              <WaveText text="Still Have Questions?" />
            </h2>
            <p className="mb-7 text-white/90 relative z-10 text-lg">Our team is always happy to help!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <a href="mailto:tsmglobalcosmetic@gmail.com" className="cta-btn px-8 py-3.5 bg-white rounded-full font-black text-sm" style={{ color:"#f97316" }}>
                <Mail className="w-4 h-4 mr-1.5" />Email Us
              </a>
              <a href="tel:+2348067030009" className="cta-btn px-8 py-3.5 rounded-full font-black text-sm text-white" style={{ background:"rgba(255,255,255,.18)", border:"2px solid rgba(255,255,255,.4)" }}>
                <Phone className="w-4 h-4 mr-1.5" />Call Us
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};