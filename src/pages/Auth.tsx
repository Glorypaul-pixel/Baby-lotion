import React, { useEffect,  useState } from "react";
import { Baby, ArrowLeft, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const AUTH_STYLES = `
  @keyframes heroTitle {
    0%   { opacity:0; transform: perspective(800px) rotateX(90deg) translateY(-40px); filter: blur(16px); }
    60%  { filter: blur(0); }
    100% { opacity:1; transform: perspective(800px) rotateX(0deg) translateY(0); }
  }
  @keyframes morphBlob {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    50%      { border-radius: 50% 60% 30% 40% / 70% 30% 50% 60%; }
    75%      { border-radius: 40% 30% 60% 70% / 30% 70% 40% 50%; }
  }
  @keyframes floatY {
    0%,100% { transform: translateY(0) rotate(0deg); }
    33%      { transform: translateY(-14px) rotate(2deg); }
    66%      { transform: translateY(-6px) rotate(-1deg); }
  }
  @keyframes badgePop {
    0%   { transform: scale(0) rotate(-20deg); opacity:0; }
    70%  { transform: scale(1.2) rotate(5deg); }
    85%  { transform: scale(0.95) rotate(-2deg); }
    100% { transform: scale(1) rotate(0); opacity:1; }
  }
  @keyframes cardFlip {
    0%   { transform: perspective(1000px) rotateY(-10deg) rotateX(5deg) scale(0.9); opacity:0; }
    100% { transform: perspective(1000px) rotateY(0) rotateX(0) scale(1); opacity:1; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(24px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 20px rgba(249,115,22,0.35), 0 0 60px rgba(249,115,22,0.1); }
    50%      { box-shadow: 0 0 40px rgba(249,115,22,0.7), 0 0 100px rgba(249,115,22,0.25); }
  }
  @keyframes orbitRing {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes orbitRingReverse {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes errorShake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
  @keyframes spinLoader {
    to { transform: rotate(360deg); }
  }
  @keyframes waveText {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-7px); }
  }
  @keyframes iconDance {
    0%,100% { transform: rotate(0)    scale(1); }
    25%      { transform: rotate(15deg) scale(1.15); }
    50%      { transform: rotate(-5deg) scale(0.95); }
    75%      { transform: rotate(10deg) scale(1.08); }
  }

  .auth-blob {
    position: absolute; pointer-events: none;
    animation: morphBlob 9s ease-in-out infinite;
    filter: blur(2px);
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  .ab-shimmer {
    background: linear-gradient(135deg, #f97316 0%, #ec4899 50%, #fbbf24 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .auth-card {
    animation: cardFlip 0.75s cubic-bezier(.22,.68,0,1.2) 0.1s both;
  }
  .auth-field {
    transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
  }
  .auth-field:focus {
    border-color: #f97316 !important;
    box-shadow: 0 0 0 4px rgba(249,115,22,0.18);
    transform: scale(1.015);
    outline: none;
  }
  .auth-error {
    animation: errorShake 0.45s ease both;
  }
  .auth-submit {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .auth-submit:not(:disabled):hover {
    transform: scale(1.03);
    box-shadow: 0 12px 32px rgba(249,115,22,0.4);
  }
  .auth-submit:not(:disabled):active {
    transform: scale(0.97);
  }
  .auth-submit::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%);
    transform: translateX(-100%);
    transition: transform 0.55s ease;
  }
  .auth-submit:not(:disabled):hover::after {
    transform: translateX(100%);
  }
  .auth-toggle {
    transition: color 0.2s ease, transform 0.2s ease;
  }
  .auth-toggle:hover {
    transform: scale(1.05);
  }
  .auth-logo-ring {
    position: absolute; inset: -4px; border-radius: 50%;
    animation: pulseGlow 2.5s ease-in-out infinite;
  }
  .field-enter {
    animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both;
  }
  .logo-dance:hover { animation: iconDance 0.6s ease both; }
  .spin-loader {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spinLoader 0.7s linear infinite;
    display: inline-block;
  }
  .wave-char { display:inline-block; }
  @media(hover:none){.auth-blob{display:none;}}
`;

function useAuthStyles() {
  useEffect(() => {
    if (document.getElementById("pref-auth-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-auth-styles";
    s.textContent = AUTH_STYLES;
    document.head.appendChild(s);
  }, []);
}

function spawnParticles(x: number, y: number, count = 12) {
  const colors = ["#f97316","#ec4899","#fbbf24","#84cc16"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    const angle = (i / count) * Math.PI * 2;
    const dist = 50 + Math.random() * 60;
    const size = 5 + Math.random() * 7;
    p.style.cssText = `
      position:fixed; border-radius:50%; pointer-events:none; z-index:9999;
      left:${x}px; top:${y}px;
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      --ex:${Math.cos(angle)*dist}px; --ey:${Math.sin(angle)*dist}px;
      animation: explode 0.7s ease-out forwards;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

type AuthProps = { onNavigate: (page: string) => void };

export const Auth: React.FC<AuthProps> = ({ onNavigate }) => {
  useAuthStyles();
  const { signUp, signIn } = useAuth();

  const [isSignUp, setIsSignUp]   = useState(false);
  const [email,    setEmail]      = useState("");
  const [password, setPassword]   = useState("");
  const [fullname, setFullname]   = useState("");
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState("");
  const [ready,    setReady]      = useState(false);
  const [shakeKey, setShakeKey]   = useState(0);

  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);
  useEffect(() => { if (error) setShakeKey(k => k + 1); }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp({ email, password, fullname });
        toast.success("✨ Account created! Welcome to the family!");
        setIsSignUp(false);
        setEmail(""); setPassword(""); setFullname("");
      } else {
        await signIn({ email, password });
        toast.success("🎉 Signed in successfully!");
        onNavigate("home");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setIsSignUp(s => !s); setError(""); };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-20"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(135deg, #fff7ed 0%, #fce7f3 50%, #fef9c3 100%)" }}
    >
      <div className="auth-blob w-96 h-96 bg-orange-300 opacity-20 top-[-80px] left-[-80px] hidden sm:block" style={{ animationDuration: "9s" }} />
      <div className="auth-blob w-72 h-72 bg-pink-300 opacity-15 bottom-[-60px] right-[-60px] hidden sm:block" style={{ animationDuration: "11s", animationDelay: "3s" }} />
      <div className="auth-blob w-48 h-48 bg-yellow-300 opacity-10 top-1/2 left-[5%] hidden sm:block" style={{ animationDuration: "7s", animationDelay: "1.5s" }} />

      <div className="relative z-10 max-w-md w-full">

        <div className="auth-card bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="auth-blob w-48 h-48 bg-orange-100 opacity-30 -top-10 -right-10 hidden sm:block" style={{ animationDuration: "8s" }} />

          {/* Logo */}
          <div
            className={`flex justify-center mb-6 sm:mb-7 transition-all duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
            style={{ animation: ready ? "badgePop 0.7s cubic-bezier(.22,.68,0,1.4) 0.15s both" : "none" }}
          >
            <div className="relative">
              <div className="auth-logo-ring" />
              <div
                className="logo-dance relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center cursor-default"
                style={{ background: "linear-gradient(135deg, #f97316, #ec4899)", animation: "floatY 4s ease-in-out infinite" }}
              >
                <Baby className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="absolute inset-[-16px] rounded-full border-2 border-dashed border-orange-300/40 pointer-events-none" style={{ animation: "orbitRing 10s linear infinite" }} />
              <div className="absolute inset-[-28px] rounded-full border border-dotted border-pink-300/30 pointer-events-none" style={{ animation: "orbitRingReverse 15s linear infinite" }} />
            </div>
          </div>

          {/* Heading */}
          <div
            className="text-center mb-6 sm:mb-8"
            style={{ animation: ready ? "heroTitle 0.8s cubic-bezier(.22,.68,0,1.2) 0.25s both" : "none", opacity: ready ? undefined : 0 }}
          >
            <h2 className="text-2xl sm:text-3xl font-black mb-1 text-gray-900 dark:text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              {isSignUp
                ? <><span className="ab-shimmer">Create</span> Account</>
                : <>Welcome <span className="ab-shimmer">Back</span></>
              }
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">
              {isSignUp ? "Join the Preferable family today" : "Sign in to your account"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              key={shakeKey}
              className="auth-error mb-5 sm:mb-6 p-3 sm:p-4 rounded-2xl border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium flex items-start gap-2"
            >
              <span className="text-lg leading-none">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 relative z-10">
            {isSignUp && (
              <div className="field-enter" style={{ animationDelay: "0ms" }}>
                <label className="block text-xs sm:text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={fullname}
                  onChange={e => setFullname(e.target.value)}
                  placeholder="Your full name"
                  className="auth-field w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium text-sm"
                />
              </div>
            )}

            <div className="field-enter" style={{ animationDelay: isSignUp ? "80ms" : "0ms" }}>
              <label className="block text-xs sm:text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="auth-field w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium text-sm"
              />
            </div>

            <div className="field-enter" style={{ animationDelay: isSignUp ? "160ms" : "80ms" }}>
              <label className="block text-xs sm:text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="auth-field w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={e => { if (!loading) spawnParticles(e.clientX, e.clientY, 14); }}
              className="auth-submit w-full py-3.5 sm:py-4 text-white rounded-full font-black text-base sm:text-lg disabled:opacity-60 flex items-center justify-center gap-3 mt-2"
              style={{ background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)" }}
            >
              {loading ? (
                <><span className="spin-loader" /> Please wait...</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  {isSignUp ? "Create Account" : "Sign In"}
                </>
              )}
            </button>
          </form>

          <div className="mt-5 sm:mt-6 text-center relative z-10">
            <button
              onClick={switchMode}
              className="auth-toggle text-xs sm:text-sm font-bold"
              style={{ color: "#f97316" }}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <div
          className="mt-4 sm:mt-5 text-center"
          style={{ animation: ready ? "fadeUp 0.6s ease 0.8s both" : "none", opacity: ready ? undefined : 0 }}
        >
          <button
            onClick={() => onNavigate("home")}
            className="auth-toggle inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 font-semibold text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};