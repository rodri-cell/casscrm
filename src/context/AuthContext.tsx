"use client";

import React, { createContext, useContext, useState } from "react";
import { User } from "@/lib/auth";
import { loadUser, login as doLogin, logout as doLogout } from "@/lib/store";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadUser());
  const loading = false;

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = doLogin(email, password);
    if (result) {
      setUser(result);
      return true;
    }
    return false;
  };

  const logout = () => {
    doLogout();
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
