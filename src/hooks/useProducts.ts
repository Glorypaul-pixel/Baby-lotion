import { useEffect, useState } from "react";
import { getAuthHeaders } from "../contexts/AuthContext";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://preferrable-api.onrender.com/api";

// Matches the actual API response shape
export type Product = {
  id: string;
  name: string;
  tag: string;
  image: string;
  description: string;
  quantity: number;
  unit_price: string; // API returns this as a string e.g. "3851.81"
  date_created: string;
  date_updated: string;
};

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// ─── useProducts ─────────────────────────────────────────────────────────────

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}

// ─── useProduct ──────────────────────────────────────────────────────────────

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}