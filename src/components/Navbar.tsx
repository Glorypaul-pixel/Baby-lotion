import React, { useState } from 'react';
import { ShoppingCart, Sun, Moon, Menu, X, User, LogOut, Baby } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

type NavbarProps = {
  onNavigate: (page: string) => void;
  currentPage: string;
};

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Products', page: 'products' },
    { name: 'About', page: 'about' },
    { name: 'Blog', page: 'blog' },
    { name: 'Contact', page: 'contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setShowAuthMenu(false);
    onNavigate('home');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-peach-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="bg-gradient-to-br from-peach-400 to-peach-500 p-2 rounded-full transform group-hover:scale-110 transition-transform duration-300">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-peach-500 to-peach-600 bg-clip-text text-transparent">
             Preferrable
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`relative font-medium transition-colors duration-300 group ${
                  currentPage === link.page
                    ? 'text-peach-600 dark:text-peach-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-peach-600 dark:hover:text-peach-400'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-peach-500 transform origin-left transition-transform duration-300 ${
                  currentPage === link.page ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-peach-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:rotate-180"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-300" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowAuthMenu(!showAuthMenu)}
                  className="p-2 rounded-full hover:bg-peach-100 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                {showAuthMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 animate-fade-in">
                    <button
                      onClick={() => { onNavigate('orders'); setShowAuthMenu(false); }}
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-peach-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-peach-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-2 bg-peach-500 text-white rounded-full hover:bg-peach-600 transition-colors duration-300 font-medium"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 rounded-full hover:bg-peach-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-peach-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-peach-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-peach-200 dark:border-gray-700 animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors duration-300 ${
                  currentPage === link.page
                    ? 'bg-peach-100 dark:bg-gray-800 text-peach-600 dark:text-peach-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-peach-50 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
