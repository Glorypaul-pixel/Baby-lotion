import React, { useEffect, useRef, useState } from "react";
import { Calendar, User, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  published: boolean;
};

const BLOG_STYLES = `
  @keyframes heroTitle {
    0%   { opacity:0; transform: perspective(800px) rotateX(90deg) translateY(-40px); filter: blur(16px); }
    60%  { filter: blur(0); }
    100% { opacity:1; transform: perspective(800px) rotateX(0deg) translateY(0); }
  }
  @keyframes cardFlip {
    0%   { transform: perspective(1000px) rotateY(-8deg) rotateX(4deg) scale(0.92); opacity:0; }
    100% { transform: perspective(1000px) rotateY(0) rotateX(0) scale(1); opacity:1; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(28px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes morphBlob {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    50%      { border-radius: 50% 60% 30% 40% / 70% 30% 50% 60%; }
    75%      { border-radius: 40% 30% 60% 70% / 30% 70% 40% 50%; }
  }
  @keyframes badgePop {
    0%   { transform: scale(0) rotate(-20deg); opacity:0; }
    70%  { transform: scale(1.2) rotate(5deg); }
    85%  { transform: scale(0.95) rotate(-2deg); }
    100% { transform: scale(1) rotate(0); opacity:1; }
  }
  @keyframes shimmerSkeleton {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes waveText {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-7px); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 20px rgba(249,115,22,0.3), 0 0 60px rgba(249,115,22,0.08); }
    50%      { box-shadow: 0 0 40px rgba(249,115,22,0.65), 0 0 100px rgba(249,115,22,0.2); }
  }
  @keyframes dotBounce {
    0%,100% { transform: translateY(0); opacity:.5; }
    50%      { transform: translateY(-8px); opacity:1; }
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .blog-blob { position:absolute; pointer-events:none; animation: morphBlob 9s ease-in-out infinite; filter:blur(2px); }
  .ab-shimmer { background: linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .blog-reveal-up   { opacity:0; transform:translateY(28px); transition: opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .blog-reveal-up.on { opacity:1; transform:translateY(0); }
  .blog-reveal-flip     { opacity:0; }
  .blog-reveal-flip.on  { animation: cardFlip .7s cubic-bezier(.22,.68,0,1.2) both; }
  .blog-reveal-left     { opacity:0; transform:translateX(-36px); transition: opacity .6s ease, transform .6s cubic-bezier(.22,.68,0,1.2); }
  .blog-reveal-left.on  { opacity:1; transform:translateX(0); }
  .blog-card { transition: transform .35s cubic-bezier(.22,.68,0,1.2), box-shadow .35s ease; }
  .blog-card:hover { transform: translateY(-10px) scale(1.015); box-shadow: 0 28px 56px rgba(0,0,0,0.12); }
  .img-zoom { transition: transform .6s cubic-bezier(.22,.68,0,1.2); }
  .group:hover .img-zoom { transform: scale(1.08); }
  .auth-submit { transition: transform .2s ease, box-shadow .2s ease; position:relative; overflow:hidden; }
  .auth-submit:hover { transform: scale(1.03); box-shadow: 0 12px 32px rgba(249,115,22,0.35); }
  .auth-submit::after { content:''; position:absolute; inset:0; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.3) 50%,transparent 60%); transform:translateX(-100%); transition:transform .55s ease; }
  .auth-submit:hover::after { transform:translateX(100%); }
  .wave-char { display:inline-block; }
  .blog-ticker-track { animation: ticker 24s linear infinite; display:flex; width:max-content; }
  .blog-ticker-wrap  { overflow:hidden; }
  .dot-1 { animation: dotBounce .9s ease-in-out 0s infinite; }
  .dot-2 { animation: dotBounce .9s ease-in-out .15s infinite; }
  .dot-3 { animation: dotBounce .9s ease-in-out .3s infinite; }
  @media(hover:none){.blog-blob{display:none;}}
`;

function useBlogStyles() {
  useEffect(() => {
    if (document.getElementById("pref-blog-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-blog-styles";
    s.textContent = BLOG_STYLES;
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

const Reveal: React.FC<{ children: React.ReactNode; type?: "up"|"flip"|"left"; delay?: number; className?: string }> = ({
  children, type = "up", delay = 0, className = ""
}) => {
  const { ref, visible } = useInView();
  const cls = { up:"blog-reveal-up", flip:"blog-reveal-flip", left:"blog-reveal-left" }[type];
  return (
    <div ref={ref} className={`${cls} ${visible?"on":""} ${className}`}
      style={{ transitionDelay:`${delay}ms`, animationDelay: visible ? `${delay}ms` : undefined }}>
      {children}
    </div>
  );
};

function useTilt(strength = 8) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x*strength}deg) rotateX(${-y*strength}deg) scale(1.03)`;
    };
    const onLeave = () => { el.style.transition = "transform .5s ease"; el.style.transform = ""; };
    const onEnter = () => { el.style.transition = "transform .1s ease"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseenter", onEnter);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); el.removeEventListener("mouseenter", onEnter); };
  }, [strength]);
  return ref;
}

const PostView: React.FC<{ post: BlogPost; onBack: () => void }> = ({ post, onBack }) => {
  const [ready, setReady] = useState(false);
  const tiltRef = useTilt(5);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:"linear-gradient(135deg,#fff7ed 0%,#fce7f3 50%,#fef9c3 100%)" }}>
      <div className="blog-blob w-72 h-72 bg-orange-300 opacity-20 top-[-60px] left-[-60px] hidden sm:block" style={{ animationDuration:"9s" }} />
      <div className="blog-blob w-56 h-56 bg-pink-300 opacity-15 bottom-10 right-[-40px] hidden sm:block" style={{ animationDuration:"11s", animationDelay:"3s" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className={`blog-reveal-left ${ready?"on":""} mb-8 sm:mb-10`} style={{ transitionDelay:"0ms" }}>
          <button
            onClick={onBack}
            className="auth-submit inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-white text-sm sm:text-base"
            style={{ background:"linear-gradient(135deg,#f97316,#ec4899)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Back to Blog
          </button>
        </div>

        <article
          ref={tiltRef}
          className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl"
          style={{ transformStyle:"preserve-3d", animation: ready ? "cardFlip .8s cubic-bezier(.22,.68,0,1.2) .1s both" : "none", opacity: ready ? undefined : 0 }}
        >
          <div className="relative h-56 sm:h-80 md:h-96 overflow-hidden group">
            <div className="absolute inset-0 z-0" style={{ background:"linear-gradient(135deg,#f97316,#ec4899)", animation:"pulseGlow 3s ease-in-out infinite", filter:"blur(20px)", opacity:.35 }} />
            <img src={post.image_url} alt={post.title} className="img-zoom relative z-10 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-20" />
          </div>

          <div className="p-6 sm:p-8 md:p-12" style={{ transform:"translateZ(12px)" }}>
            <Reveal>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-gray-900 dark:text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
                {post.title}
              </h1>
            </Reveal>
            <Reveal delay={100}>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6 sm:mb-8 text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{new Date(post.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Preferable Team</span>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-line">{post.content}</p>
            </Reveal>
          </div>
        </article>
      </div>
    </div>
  );
};

export const Blog: React.FC = () => {
  useBlogStyles();
  const [posts, setPosts]               = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading]           = useState(true);
  const [ready, setReady]               = useState(false);

  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const mockPosts: BlogPost[] = [
          { id:1, title:"Caring for Newborn Skin",    excerpt:"Tips and tricks for keeping your baby's skin soft and healthy.",                                       content:"Your baby's skin is delicate and requires special care... (full article here).",                              image_url:"/images/baby.jpg",  created_at:new Date().toISOString(), published:true },
          { id:2, title:"Best Bedtime Routines",       excerpt:"How to create a calming routine that helps your baby sleep better.",                                    content:"Establishing a consistent bedtime routine helps your baby understand when it's time to sleep...",              image_url:"/images/green.png", created_at:new Date().toISOString(), published:true },
          { id:3, title:"Choosing Natural Skincare",   excerpt:"A guide to picking the safest and most effective products for your little one.",                        content:"When choosing skincare for your baby, always look for natural, dermatologist-tested ingredients...",           image_url:"/images/care.png",  created_at:new Date().toISOString(), published:true },
        ];
        await new Promise(r => setTimeout(r, 1000));
        setPosts(mockPosts);
        toast.success("Blog posts loaded!");
      } catch { toast.error("Failed to load blog posts."); }
      finally  { setLoading(false); }
    };
    fetchPosts();
  }, []);

  if (selectedPost) return <PostView post={selectedPost} onBack={() => { setSelectedPost(null); }} />;

  const tickerItems = ["✦ BABY CARE TIPS", "✦ NATURAL SKINCARE", "✦ BEDTIME ROUTINES", "✦ HEALTHY SKIN", "✦ EXPERT ADVICE", "✦ PARENTING GUIDE"];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:"linear-gradient(135deg,#fff7ed 0%,#fce7f3 50%,#fef9c3 100%)" }}>
      <div className="blog-blob w-96 h-96 bg-orange-300 opacity-20 top-[-80px] left-[-80px] hidden sm:block" style={{ animationDuration:"9s" }} />
      <div className="blog-blob w-64 h-64 bg-pink-300 opacity-15 bottom-20 right-[-40px] hidden sm:block" style={{ animationDuration:"11s", animationDelay:"3s" }} />

      {/* Header */}
      <section className="relative pt-24 sm:pt-28 pb-10 sm:pb-16 text-center z-10 px-4">
        <div
          className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-xs sm:text-sm font-black mb-4 sm:mb-6"
          style={{ background:"linear-gradient(135deg,#f97316,#ec4899,#fbbf24)", animation: ready ? "badgePop .6s cubic-bezier(.22,.68,0,1.4) both" : "none", opacity: ready ? undefined : 0 }}
        >
          ✦ OUR BLOG ✦
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-black mb-3 sm:mb-4 leading-tight"
          style={{ fontFamily:"'Syne',sans-serif", animation: ready ? "heroTitle 1s cubic-bezier(.22,.68,0,1.2) .1s both" : "none", opacity: ready ? undefined : 0 }}
        >
          <span className="ab-shimmer">Blog</span> &amp; Tips
        </h1>
        <p className={`text-base sm:text-xl text-gray-600 dark:text-gray-400 blog-reveal-up ${ready?"on":""}`} style={{ transitionDelay:"350ms" }}>
          Expert advice and tips for caring for your little one
        </p>
      </section>

      {/* Ticker */}
      <div className="blog-ticker-wrap py-2.5 sm:py-3 mb-8 sm:mb-12" style={{ background:"linear-gradient(90deg,#f97316,#ec4899)", borderTop:"2px solid #fbbf24", borderBottom:"2px solid #fbbf24" }}>
        <div className="blog-ticker-track">
          {[...tickerItems,...tickerItems].map((item,i) => (
            <span key={i} className="text-white font-black text-xs sm:text-sm tracking-widest px-5 sm:px-8 flex-shrink-0">{item}</span>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {[...Array(3)].map((_,i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg h-64 sm:h-80 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation:`shimmerSkeleton 1.6s ease ${i*.2}s infinite` }} />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-300 dot-1" />
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-300 dot-2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 dot-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {posts.map((post, index) => (
              <Reveal key={post.id} type="flip" delay={index * 130}>
                <div
                  className="blog-card group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg cursor-pointer relative"
                  style={{ transformStyle:"preserve-3d" }}
                  onClick={() => { toast.success(`Opening "${post.title}"`); setSelectedPost(post); }}
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-200 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none hidden sm:block" style={{ animation:"morphBlob 5s ease infinite" }} />

                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img src={post.image_url} alt={post.title} className="img-zoom w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div
                      className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2.5 sm:px-3 py-1 rounded-full text-white text-xs font-black"
                      style={{ background:"linear-gradient(135deg,#f97316,#ec4899)", animation:`badgePop .6s cubic-bezier(.22,.68,0,1.4) ${index*130+300}ms both` }}
                    >
                      ✦ Article
                    </div>
                  </div>

                  <div className="p-5 sm:p-6" style={{ transform:"translateZ(12px)" }}>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-2 sm:mb-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{new Date(post.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />Preferable</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2 line-clamp-2" style={{ fontFamily:"'Syne',sans-serif" }}>{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 line-clamp-3 text-xs sm:text-sm leading-relaxed">{post.excerpt}</p>
                    <div
                      className="inline-flex items-center gap-2 font-black text-xs sm:text-sm transition-all duration-300 group-hover:gap-3"
                      style={{ color:"#f97316" }}
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};