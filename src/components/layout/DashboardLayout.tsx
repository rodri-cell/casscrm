"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import type { UserRole } from "@/lib/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
        return;
      }
      if (requiredRole && user.role !== requiredRole) {
        router.replace(user.role === "agency" ? "/dashboard" : "/portal");
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f5f7" }}>
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!user) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return (
    <div className="flex min-h-screen" style={{ background: "#f5f5f7" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
