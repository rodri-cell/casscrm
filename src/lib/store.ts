"use client";

// Simple client-side auth store using localStorage
import { User, getUserByEmail } from "./auth";

const AUTH_KEY = "crm_auth_user";

export function saveUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
}

export function loadUser(): User | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as User;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function login(email: string, _password: string): User | null {
  // In a real app, validate password against DB
  // For demo, any password works for mock users
  const user = getUserByEmail(email);
  if (user) {
    saveUser(user);
    return user;
  }
  return null;
}

export function logout(): void {
  clearUser();
}
