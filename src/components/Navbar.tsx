import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  Baby,
  LayoutDashboard,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
  @keyframes badgePop{0%{transform:scale(0) rotate(-20deg);opacity:0;}70%{transform:scale(1.2) rotate(5deg);}85%{transform:scale(.95) rotate(-2deg);}100%{transform:scale(1) rotate(0);opacity:1;}}
  @keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
  @keyframes mobileIn{from{opacity:0;transform:translateY(-12px);}to{opacity:1;transform:translateY(0);}}
  @keyframes dropIn{from{opacity:0;transform:translateY(-8px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);}}
  @keyframes countPop{0%{transform:scale(0);}70%{transform:scale(1.2);}100%{transform:scale(1);}}
  .nb-logo-icon{animation:floatY 3.5s ease-in-out infinite;}
  .nb-link{position:relative;transition:color .2s ease;}
  .nb-link::after{content:"";position:absolute;left:0;bottom:-2px;width:0;height:2px;background:linear-gradient(90deg,#f97316,#ec4899);border-radius:2px;transition:width .3s ease;}
  .nb-link:hover::after,.nb-link.active::after{width:100%;}
  .nb-icon-btn{transition:transform .2s cubic-bezier(.22,.68,0,1.4),background .2s ease;}
  .nb-icon-btn:hover{transform:scale(1.12);}
  .nb-signin{transition:transform .2s ease,box-shadow .2s ease;position:relative;overflow:hidden;}
  .nb-signin:hover{transform:scale(1.04);box-shadow:0 8px 20px rgba(249,115,22,.35);}
  .nb-signin::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.3) 50%,transparent 60%);transform:translateX(-100%);transition:transform .5s ease;}
  .nb-signin:hover::after{transform:translateX(100%);}
  .nb-cart-count{animation:countPop .4s cubic-bezier(.22,.68,0,1.4) both;}
  .nb-dropdown{animation:dropIn .25s cubic-bezier(.22,.68,0,1.2) both;}
  .nb-dropdown-item{transition:background .15s ease,transform .15s ease,color .15s ease;}
  .nb-dropdown-item:hover{transform:translateX(3px);}
  .nb-mobile{animation:mobileIn .3s cubic-bezier(.22,.68,0,1.2) both;}
  .nb-mobile-item{transition:background .15s ease,transform .15s ease;}
  .nb-mobile-item:hover{transform:translateX(4px);}
  .ab-shimmer{background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#fbbf24 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
`;

function useStyles() {
  useEffect(() => {
    if (document.getElementById("pref-nb-styles")) return;
    const s = document.createElement("style");
    s.id = "pref-nb-styles";
    s.textContent = STYLES;
    document.head.appendChild(s);
  }, []);
}

type NavbarProps = { onNavigate: (page: string) => void; currentPage: string };

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  useStyles();
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authMenu, setAuthMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close auth dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".nb-auth-wrap")) setAuthMenu(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const navLinks = [
    { name: "Home", page: "home" },
    { name: "Products", page: "products" },
    { name: "About", page: "about" },
    { name: "Blog", page: "blog" },
    { name: "Contact", page: "contact" },
  ];

  const go = (page: string) => {
    onNavigate(page);
    setAuthMenu(false);
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    go("home");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(255,255,255,.92)"
          : "rgba(255,255,255,.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(249,115,22,.15)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 32px rgba(249,115,22,.08)" : "none",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* ── Logo ── */}
          <div
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
            onClick={() => go("home")}
          >
            <div
              className="nb-logo-icon w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#f97316,#ec4899)" }}
            >
              <Baby className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span
              className="text-base sm:text-xl font-black ab-shimmer"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              Preferrable
            </span>
          </div>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => go(link.page)}
                className={`nb-link text-sm font-bold transition-colors ${
                  currentPage === link.page
                    ? "text-orange-500 active"
                    : "text-gray-700 dark:text-gray-300 hover:text-orange-500"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* ── Right icons ── */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="nb-icon-btn p-2 rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Auth */}
            {user ? (
              <div className="relative nb-auth-wrap">
                <button
                  onClick={() => setAuthMenu(!authMenu)}
                  className="nb-icon-btn p-2 rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                  aria-label="Account"
                >
                  <User size={16} />
                </button>
                {authMenu && (
                  <div
                    className="nb-dropdown absolute right-0 mt-2 w-48 sm:w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl py-2 overflow-hidden"
                    style={{ border: "1px solid rgba(249,115,22,.15)" }}
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        My Account
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => go("admin")}
                        className="nb-dropdown-item w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => go("orders")}
                      className="nb-dropdown-item w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700"
                    >
                      My Orders
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="nb-dropdown-item w-full px-4 py-2.5 text-left text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => go("auth")}
                className="nb-signin hidden sm:block px-4 sm:px-5 py-1.5 sm:py-2 text-white rounded-full text-xs sm:text-sm font-black ml-1"
                style={{
                  background: "linear-gradient(135deg,#f97316,#ec4899)",
                }}
              >
                Sign In
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => go("cart")}
              className="nb-icon-btn relative p-2 rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label="Cart"
            >
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span
                  className="nb-cart-count absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full text-white text-[9px] sm:text-xs font-black flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#f97316,#ec4899)",
                  }}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden nb-icon-btn p-2 rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 ml-0.5"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden nb-mobile bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-orange-100 dark:border-gray-700 max-h-[80vh] overflow-y-auto">
          <div className="px-3 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => go(link.page)}
                className={`nb-mobile-item block w-full text-left px-4 py-3 rounded-xl font-bold text-sm ${
                  currentPage === link.page
                    ? "text-orange-500 bg-orange-50"
                    : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800"
                }`}
              >
                {link.name}
              </button>
            ))}

            {/* Sign in (mobile, logged out) */}
            {!user && (
              <button
                onClick={() => go("auth")}
                className="block w-full text-center px-4 py-3 rounded-xl font-black text-sm text-white"
                style={{
                  background: "linear-gradient(135deg,#f97316,#ec4899)",
                }}
              >
                Sign In
              </button>
            )}

            {user && isAdmin && (
              <button
                onClick={() => go("admin")}
                className="nb-mobile-item flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800"
              >
                <LayoutDashboard size={15} /> Dashboard
              </button>
            )}

            {user && (
              <>
                <button
                  onClick={() => go("orders")}
                  className="nb-mobile-item block w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800"
                >
                  My Orders
                </button>
                <button
                  onClick={handleSignOut}
                  className="nb-mobile-item flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
