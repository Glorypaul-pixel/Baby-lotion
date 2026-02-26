// src/hooks/useProducts.ts
import { useEffect, useState } from "react";

export type Product = {
  id: string;
  name: string;
  tag: "baby soap" | "baby lotion" | "adult lotion";
  image: string;
  description: string;
  quantity: number;
  unit_price: string;
  date_created: string;
  date_updated: string;
};

export type ProductPayload = {
  name: string;
  tag: "baby soap" | "baby lotion" | "adult lotion";
  image: string;
  description: string;
  quantity: number;
  unit_price: string;
};

// PATCH allows all fields to be optional
export type ProductPatch = Partial<ProductPayload>;

type UseProductsReturn = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getProduct: (id: string) => Promise<Product>;
  createProduct: (payload: ProductPayload) => Promise<Product>;
  updateProduct: (id: string, payload: ProductPayload) => Promise<Product>;
  patchProduct: (id: string, payload: ProductPatch) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
};

// ✅ Must match AuthContext — VITE_API_BASE already includes /api
const API_BASE_URL =
  import.meta.env.VITE_API_BASE ?? "https://preferrable-api.onrender.com/api";

// ── shared fetch helper ─────────────────────────────────────────────────────
const apiFetch = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  // 204 No Content (DELETE) — nothing to parse
  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }

  return res.json() as Promise<T>;
};

// ── hook ────────────────────────────────────────────────────────────────────
export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  // GET /api/products/
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<Product[]>("/products/");
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => { cancelled = true; };
  }, [trigger]);

  const refetch = () => setTrigger((t) => t + 1);

  // GET /api/products/{id}/
  const getProduct = (id: string): Promise<Product> =>
    apiFetch<Product>(`/products/${id}/`);

  // POST /api/products/
  const createProduct = (payload: ProductPayload): Promise<Product> =>
    apiFetch<Product>("/products/", {
      method: "POST",
      body: JSON.stringify(payload),
    });

  // PUT /api/products/{id}/
  const updateProduct = (id: string, payload: ProductPayload): Promise<Product> =>
    apiFetch<Product>(`/products/${id}/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

  // PATCH /api/products/{id}/
  const patchProduct = (id: string, payload: ProductPatch): Promise<Product> =>
    apiFetch<Product>(`/products/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

  // DELETE /api/products/{id}/  →  204 No Content
  const deleteProduct = (id: string): Promise<void> =>
    apiFetch<void>(`/products/${id}/`, { method: "DELETE" });

  return {
    products,
    loading,
    error,
    refetch,
    getProduct,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct,
  };
};