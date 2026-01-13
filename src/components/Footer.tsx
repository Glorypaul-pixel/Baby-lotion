import React from "react";
import {
  Baby,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

type FooterProps = {
  onNavigate: (page: string) => void;
};

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gradient-to-br from-peach-50 to-peach-100 dark:from-gray-900 dark:to-gray-800 border-t border-peach-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + Description + Social */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-peach-400 to-peach-500 p-2 rounded-full">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-peach-500 to-peach-600 bg-clip-text text-transparent">
                PREFERABLE
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Gentle care for your little ones. Premium baby care products made
              with love and natural ingredients.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-peach-200 dark:bg-gray-700 hover:bg-peach-300 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                <Facebook className="w-4 h-4 text-peach-600 dark:text-peach-400" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-peach-200 dark:bg-gray-700 hover:bg-peach-300 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                <Instagram className="w-4 h-4 text-peach-600 dark:text-peach-400" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-peach-200 dark:bg-gray-700 hover:bg-peach-300 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                <Twitter className="w-4 h-4 text-peach-600 dark:text-peach-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Home", "Products", "About", "Blog", "Contact"].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => onNavigate(link.toLowerCase())}
                    className="text-gray-600 dark:text-gray-400 hover:text-peach-600 dark:hover:text-peach-400 transition-colors duration-300 text-sm"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate("shipping")}
                  className="text-gray-600 dark:text-gray-400 hover:text-peach-600 dark:hover:text-peach-400 transition-colors duration-300 text-sm"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("returns")}
                  className="text-gray-600 dark:text-gray-400 hover:text-peach-600 dark:hover:text-peach-400 transition-colors duration-300 text-sm"
                >
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("faq")}
                  className="text-gray-600 dark:text-gray-400 hover:text-peach-600 dark:hover:text-peach-400 transition-colors duration-300 text-sm"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button className="text-gray-600 dark:text-gray-400 hover:text-peach-600 dark:hover:text-peach-400 transition-colors duration-300 text-sm">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-peach-500" />
                <span>(23/24 CAT) Borno Plaza, Trade Fair, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0 text-peach-500" />
                <span>(+234) 080-6703-0009 </span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0 text-peach-500" />
                <span>tsmglobalcosmetic@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-peach-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 PREFERABLE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
