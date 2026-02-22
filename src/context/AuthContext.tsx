"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/lib/database.types";
import { signIn, signOut, getCurrentUser, onAuthStateChange } from "@/lib/services/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load current session on mount
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });

    // Subscribe to auth state changes (token refresh, sign out from another tab, etc.)
    const unsubscribe = onAuthStateChange((u) => {
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const result = await signIn(email, password);
    setUser(result);
    setLoading(false);
    return result !== null;
  };

  const logout = async (): Promise<void> => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
