// src/pages/admin/Sidebar.tsx
import React from "react";
import { Home, Package, ShoppingCart, Users, FileText, Settings } from "lucide-react";

type SidebarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const links = [
    { name: "Dashboard", page: "dashboard", icon: <Home size={16} /> },
    { name: "Products", page: "products", icon: <Package size={16} /> },
    { name: "Orders", page: "orders", icon: <ShoppingCart size={16} /> },
    { name: "Users", page: "users", icon: <Users size={16} /> },
    { name: "Content", page: "content", icon: <FileText size={16} /> },
    { name: "Settings", page: "settings", icon: <Settings size={16} /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Admin Panel</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.page}>
            <button
              onClick={() => onNavigate(link.page)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-peach-50 dark:hover:bg-gray-800 transition-colors ${
                currentPage === link.page
                  ? "bg-peach-100 dark:bg-gray-800 text-peach-600 dark:text-peach-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {link.icon}
              {link.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
