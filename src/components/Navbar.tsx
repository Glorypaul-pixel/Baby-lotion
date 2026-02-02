import React, { useState } from "react";
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

type NavbarProps = {
  onNavigate: (page: string) => void;
  currentPage: string;
};

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  const navLinks = [
    { name: "Home", page: "home" },
    { name: "Products", page: "products" },
    { name: "About", page: "about" },
    { name: "Blog", page: "blog" },
    { name: "Contact", page: "contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
    setShowAuthMenu(false);
    setMobileMenuOpen(false);
    onNavigate("home");
  };

  const navigateAndClose = (page: string) => {
    onNavigate(page);
    setShowAuthMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-peach-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigateAndClose("home")}
          >
            <div className="bg-gradient-to-br from-peach-400 to-peach-500 p-2 rounded-full group-hover:scale-110 transition">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-peach-500 to-peach-600 bg-clip-text text-transparent">
              Preferrable
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => navigateAndClose(link.page)}
                className={`font-medium transition ${
                  currentPage === link.page
                    ? "text-peach-600"
                    : "text-gray-700 dark:text-gray-300 hover:text-peach-600"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-peach-100 dark:hover:bg-gray-800"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Auth Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowAuthMenu(!showAuthMenu)}
                  className="p-2 rounded-full hover:bg-peach-100 dark:hover:bg-gray-800"
                >
                  <User size={18} />
                </button>

                {showAuthMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                    
                    {/* Admin Dashboard */}
                    {isAdmin && (
                      <button
                        onClick={() => navigateAndClose("admin")}
                        className="w-full px-4 py-2 text-left hover:bg-peach-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </button>
                    )}

                    {/* My Orders */}
                    <button
                      onClick={() => navigateAndClose("orders")}
                      className="w-full px-4 py-2 text-left hover:bg-peach-50 dark:hover:bg-gray-700"
                    >
                      My Orders
                    </button>

                    {/* Sign Out */}
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left hover:bg-peach-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigateAndClose("auth")}
                className="px-4 py-2 bg-peach-500 text-white rounded-full hover:bg-peach-600"
              >
                Sign In
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => navigateAndClose("cart")}
              className="relative p-2 rounded-full hover:bg-peach-100 dark:hover:bg-gray-800"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-peach-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-peach-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => navigateAndClose(link.page)}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-peach-50 dark:hover:bg-gray-800"
              >
                {link.name}
              </button>
            ))}

            {/* Admin Dashboard (mobile) */}
            {user && isAdmin && (
              <button
                onClick={() => navigateAndClose("admin")}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-peach-50 dark:hover:bg-gray-800"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
