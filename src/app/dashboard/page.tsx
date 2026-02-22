"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getClients } from "@/lib/services/clients";
import { getCampaigns } from "@/lib/services/campaigns";
import type { Client, Campaign } from "@/lib/database.types";
import Link from "next/link";

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "#d1fae5", text: "#065f46" },
  paused: { bg: "#fef3c7", text: "#92400e" },
  completed: { bg: "#f3f4f6", text: "#374151" },
  draft: { bg: "#dbeafe", text: "#1e40af" },
  inactive: { bg: "#fee2e2", text: "#991b1b" },
  prospect: { bg: "#ede9fe", text: "#5b21b6" },
};

const statusLabels: Record<string, string> = {
  active: "Activo",
  paused: "Pausado",
  completed: "Completado",
  draft: "Borrador",
  inactive: "Inactivo",
  prospect: "Prospecto",
};

const typeLabels: Record<string, string> = {
  social: "Redes Sociales",
  email: "Email",
  seo: "SEO",
  ppc: "PPC",
  content: "Contenido",
};

export default function AgencyDashboard() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getClients(), getCampaigns()])
      .then(([c, camp]) => {
        setClients(c);
        setCampaigns(camp);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeClients = clients.filter((c) => c.status === "active").length;
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const totalBudget = clients.reduce((sum, c) => sum + c.monthlyBudget, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const recentCampaigns = campaigns.slice(0, 4);

  return (
    <DashboardLayout requiredRole="agency">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl font-semibold"
            style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
          >
            Hola, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6e6e73" }}>
            Aquí tienes el resumen de tu agencia
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
            />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Clientes Activos", value: activeClients, sub: `de ${clients.length} totales`, icon: "👥", color: "#6366f1" },
                { label: "Campañas Activas", value: activeCampaigns, sub: `de ${campaigns.length} totales`, icon: "🚀", color: "#0ea5e9" },
                { label: "Presupuesto Mensual", value: `€${totalBudget.toLocaleString()}`, sub: "suma de clientes", icon: "💰", color: "#10b981" },
                { label: "Conversiones", value: totalConversions, sub: "en todas las campañas", icon: "🎯", color: "#f59e0b" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-5"
                  style={{
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs font-medium" style={{ color: "#6e6e73" }}>{stat.label}</p>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <p className="text-2xl font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#aeaeb2" }}>{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Recent Campaigns */}
              <div
                className="lg:col-span-2 rounded-2xl p-6"
                style={{
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>
                    Campañas Recientes
                  </h2>
                  <Link
                    href="/dashboard/campaigns"
                    className="text-xs font-medium transition-colors"
                    style={{ color: "#6366f1" }}
                  >
                    Ver todas →
                  </Link>
                </div>
                {recentCampaigns.length === 0 ? (
                  <p className="text-sm text-center py-8" style={{ color: "#aeaeb2" }}>
                    No hay campañas todavía
                  </p>
                ) : (
                  <div className="space-y-2">
                    {recentCampaigns.map((camp) => (
                      <div
                        key={camp.id}
                        className="flex items-center gap-4 p-3 rounded-xl transition-all"
                        style={{ background: "#f5f5f7" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#ebebeb")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#f5f5f7")}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: "#1d1d1f" }}>
                            {camp.name}
                          </p>
                          <p className="text-xs truncate" style={{ color: "#8e8e93" }}>
                            {camp.clientName} · {typeLabels[camp.type]}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-medium" style={{ color: "#1d1d1f" }}>
                            €{camp.spent.toLocaleString()}
                          </p>
                          <p className="text-xs" style={{ color: "#aeaeb2" }}>
                            de €{camp.budget.toLocaleString()}
                          </p>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                          style={{
                            background: statusColors[camp.status]?.bg,
                            color: statusColors[camp.status]?.text,
                          }}
                        >
                          {statusLabels[camp.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clients */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>
                    Clientes
                  </h2>
                  <Link
                    href="/dashboard/clients"
                    className="text-xs font-medium"
                    style={{ color: "#6366f1" }}
                  >
                    Ver todos →
                  </Link>
                </div>
                {clients.length === 0 ? (
                  <p className="text-sm text-center py-8" style={{ color: "#aeaeb2" }}>
                    No hay clientes todavía
                  </p>
                ) : (
                  <div className="space-y-2">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f7")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: "#ede9fe", color: "#6366f1" }}
                        >
                          {client.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "#1d1d1f" }}>
                            {client.name}
                          </p>
                          <p className="text-xs truncate" style={{ color: "#aeaeb2" }}>
                            {client.company}
                          </p>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                          style={{
                            background: statusColors[client.status]?.bg,
                            color: statusColors[client.status]?.text,
                          }}
                        >
                          {statusLabels[client.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
