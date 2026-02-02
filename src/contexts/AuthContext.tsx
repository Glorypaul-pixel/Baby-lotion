// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string) => Promise<void>;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = "mock_user";
const ADMIN_EMAIL = "admin@example.com";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ derive admin status from user
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0],
      role: email === ADMIN_EMAIL ? "admin" : "user",
      created_at: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    toast.success("Account created!");
  };

  const signIn = async (email: string) => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedUser) throw new Error("No user found. Please sign up.");

    const parsedUser: User = JSON.parse(storedUser);
    if (parsedUser.email !== email) throw new Error("Invalid email");

    setUser(parsedUser);
    toast.success("Signed in!");
  };

  const signOut = async () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
    toast.success("Signed out!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin, // ✅ THIS WAS MISSING
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
