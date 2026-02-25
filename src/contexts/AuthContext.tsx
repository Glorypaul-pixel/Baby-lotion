import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export type User = {
  id: string;
  email: string;
  fullname?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (data: {
    email: string;
    password: string;
    fullname?: string;
  }) => Promise<void>;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth_user";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const ADMIN_EMAILS = ["brianobot9@gmail.com"];

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://preferrable-api.onrender.com/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function normalizeError(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return fallback;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email) : false;

  // Restore session on mount
  useEffect(() => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const stored = localStorage.getItem(STORAGE_KEY);

      if (accessToken && stored) {
        if (isTokenExpired(accessToken)) {
          clearStorage();
        } else {
          setUser(JSON.parse(stored));
        }
      }
    } catch {
      clearStorage();
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= SIGN UP =================
  // Response: { detail, email, fullname, date_created, date_updated }
  // No token returned — user must sign in after signing up
  const signUp = async (data: {
    email: string;
    password: string;
    fullname?: string;
  }) => {
    try {
      const res = await fetch(`${API_BASE}/users/sign_up/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullname: data.fullname ?? data.email.split("@")[0],
        }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.detail || result.message || "Signup failed");

      toast.success(result.detail || "Account created!");
    } catch (err: unknown) {
      const message = normalizeError(err, "Signup failed");
      console.error(err);
      toast.error(message);
      throw new Error(message);
    }
  };

  // ================= SIGN IN =================
  // Response: { detail, user: { id, email }, access_token, refresh_token }
  const signIn = async (data: { email: string; password: string }) => {
    try {
      const res = await fetch(`${API_BASE}/users/sign_in/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(
          result.detail || result.message || "Invalid credentials"
        );

      const user: User = result.user;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(ACCESS_TOKEN_KEY, result.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.refresh_token);

      setUser(user);
      toast.success(result.detail || "Welcome back!");
    } catch (err: unknown) {
      const message = normalizeError(err, "Login failed");
      console.error(err);
      toast.error(message);
      throw new Error(message);
    }
  };

  // ================= SIGN OUT =================
  const signOut = () => {
    clearStorage();
    setUser(null);
    toast.success("Signed out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};