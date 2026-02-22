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
        // Redirect to correct area
        if (user.role === "agency") {
          router.replace("/dashboard");
        } else {
          router.replace("/portal");
        }
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
