// src/contexts/CartContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { getAccessToken } from "./AuthContext";

// ── Types ────────────────────────────────────────────────────────────────────

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  is_featured: boolean;
  description: string;
  created_at: string;
};

export type CartApiItem = {
  id: string;
  product: string;
  quantity: number;
  date_created: string;
  date_updated: string;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
};

// ── API helper ───────────────────────────────────────────────────────────────

const API_BASE_URL =
  import.meta.env.VITE_API_BASE ?? "https://preferrable-api.onrender.com/api";

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ── localStorage helpers ─────────────────────────────────────────────────────

const PRODUCT_MAP_KEY = "cart_product_map";

function loadProductMap(): Record<string, Product> {
  try {
    const stored = localStorage.getItem(PRODUCT_MAP_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveProductMap(map: Record<string, Product>) {
  try {
    localStorage.setItem(PRODUCT_MAP_KEY, JSON.stringify(map));
  } catch {
    // storage full or unavailable — fail silently
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartApiItem[]>([]);

  // ✅ Load productMap from localStorage on first render so cart survives refresh
  const [productMap, setProductMap] =
    useState<Record<string, Product>>(loadProductMap);

  const [loading, setLoading] = useState(false);

  // ✅ Persist productMap to localStorage whenever it changes
  useEffect(() => {
    saveProductMap(productMap);
  }, [productMap]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const items = await apiFetch<CartApiItem[]>("/carts/");
      setCartItems(items);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token) fetchCart();
  }, []);

  const cart: CartItem[] = useMemo(
    () =>
      cartItems
        .filter((item) => productMap[item.product])
        .map((item) => ({
          id: item.id,
          product: productMap[item.product],
          quantity: item.quantity,
        })),
    [cartItems, productMap],
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart],
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const addToCart = async (product: Product, quantity = 1) => {
    // ✅ Always keep productMap up to date so we have product details after refresh
    setProductMap((prev) => ({ ...prev, [product.id]: product }));

    const existing = cartItems.find((item) => item.product === product.id);

    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity);
    } else {
      try {
        const newItem = await apiFetch<CartApiItem>("/carts/", {
          method: "POST",
          body: JSON.stringify({ product: product.id, quantity }),
        });
        setCartItems((prev) => [...prev, newItem]);
      } catch (err) {
        console.error("Failed to add to cart:", err);
        throw err;
      }
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const updated = await apiFetch<CartApiItem>(`/carts/${cartItemId}/`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      });
      setCartItems((prev) =>
        prev.map((item) => (item.id === cartItemId ? updated : item)),
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
      throw err;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      await apiFetch<void>(`/carts/${cartItemId}/`, { method: "DELETE" });
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      throw err;
    }
  };

  const clearCart = () => {
    setCartItems([]);
    // ✅ Also wipe the persisted product map on explicit cart clear
    setProductMap({});
    localStorage.removeItem(PRODUCT_MAP_KEY);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
