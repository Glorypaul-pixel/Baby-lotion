import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider, useCart } from "./contexts/CartContext";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Loader } from "./components/Loader";

import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { About } from "./pages/About";
import { Blog } from "./pages/Blog";
import { Contact } from "./pages/Contact";
import { Cart } from "./pages/Cart";
import { Auth } from "./pages/Auth";
import { Checkout } from "./pages/Checkout";
import { Orders } from "./pages/Orders";
import { Shipping } from "./pages/Shipping";
import { Returns } from "./pages/Returns";
import { PrivacyPolicy } from "./pages/Privacypolicy";
import { FAQ } from "./pages/FAQ";
import { AdminDashboard } from "./pages/admin/Dashboard";

/* App Content */
const AppContent = () => {
  const { user, loading } = useAuth();
  const { fetchCart, clearCart } = useCart();
  const [currentPage, setCurrentPage] = useState("home");

  React.useEffect(() => {
    if (loading) return;
    if (user) {
      fetchCart();
    } else {
      clearCart();
    }
  }, [user, loading]);

  if (loading) return <Loader fullScreen message="Starting up" />;

  const isAdmin = currentPage === "admin";

  const renderPage = () => {
    if (isAdmin) {
      if (!user) return <Auth onNavigate={setCurrentPage} />;
      return <AdminDashboard onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case "home":
        return <Home onNavigate={setCurrentPage} />;
      case "products":
        return <Products onNavigate={setCurrentPage} />;
      case "about":
        return <About />;
      case "blog":
        return <Blog />;
      case "contact":
        return <Contact />;
      case "cart":
        return <Cart onNavigate={setCurrentPage} />;
      case "auth":
        return user ? (
          <Home onNavigate={setCurrentPage} />
        ) : (
          <Auth onNavigate={setCurrentPage} />
        );
      case "checkout":
        return user ? (
          <Checkout onNavigate={setCurrentPage} />
        ) : (
          <Auth onNavigate={setCurrentPage} />
        );
      case "orders":
        return user ? (
          <Orders onNavigate={setCurrentPage} />
        ) : (
          <Auth onNavigate={setCurrentPage} />
        );
      case "shipping":
        return <Shipping />;
      case "returns":
        return <Returns />;
      case "privacy":
        return <PrivacyPolicy onNavigate={setCurrentPage} />;
      case "faq":
        return <FAQ />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {!isAdmin && (
        <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      )}
      <main>{renderPage()}</main>
      {!isAdmin && <Footer onNavigate={setCurrentPage} />}
    </div>
  );
};

/* App */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
