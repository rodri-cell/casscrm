"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getClientByProfileId } from "@/lib/services/clients";
import { getCampaignsByClientId } from "@/lib/services/campaigns";
import type { Client, Campaign } from "@/lib/database.types";
import Link from "next/link";

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "#d1fae5", text: "#065f46" },
  paused: { bg: "#fef3c7", text: "#92400e" },
  completed: { bg: "#f3f4f6", text: "#374151" },
  draft: { bg: "#dbeafe", text: "#1e40af" },
};

const statusLabels: Record<string, string> = {
  active: "Activo",
  paused: "Pausado",
  completed: "Completado",
  draft: "Borrador",
};

const typeIcons: Record<string, string> = {
  social: "📱",
  email: "📧",
  seo: "🔍",
  ppc: "💰",
  content: "✍️",
};

const typeLabels: Record<string, string> = {
  social: "Redes Sociales",
  email: "Email Marketing",
  seo: "SEO",
  ppc: "PPC / Ads",
  content: "Contenido",
};

export default function ClientPortal() {
  const { user } = useAuth();
  const [clientData, setClientData] = useState<Client | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getClientByProfileId(user.id).then(async (client) => {
      setClientData(client);
      if (client) {
        const camps = await getCampaignsByClientId(client.id);
        setCampaigns(camps);
      }
      setLoading(false);
    });
  }, [user]);

  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);

  return (
    <DashboardLayout requiredRole="client">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl font-semibold"
            style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
          >
            Hola, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6e6e73" }}>
            {clientData?.company ?? user?.company} · Resumen de tus campañas
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "#0ea5e9", borderTopColor: "transparent" }}
            />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Campañas Activas", value: activeCampaigns.length, sub: `de ${campaigns.length} totales` },
                { label: "Presupuesto Mensual", value: `€${(clientData?.monthlyBudget ?? 0).toLocaleString()}`, sub: "acordado con la agencia" },
                { label: "Clics Totales", value: totalClicks.toLocaleString(), sub: "en todas las campañas" },
                { label: "Conversiones", value: totalConversions, sub: `€${totalSpent.toLocaleString()} invertidos` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-5"
                  style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <p className="text-xs font-medium mb-2" style={{ color: "#6e6e73" }}>{s.label}</p>
                  <p className="text-2xl font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                    {s.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#aeaeb2" }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Campaigns */}
            <div
              className="rounded-2xl p-6 mb-5"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>
                  Mis Campañas
                </h2>
                <Link href="/portal/campaigns" className="text-xs font-medium" style={{ color: "#0ea5e9" }}>
                  Ver detalle →
                </Link>
              </div>

              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🚀</p>
                  <p className="text-sm font-medium" style={{ color: "#3a3a3c" }}>
                    Aún no tienes campañas activas
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#aeaeb2" }}>
                    Contacta con tu agencia para empezar
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((camp) => {
                    const pct = camp.budget > 0 ? Math.round((camp.spent / camp.budget) * 100) : 0;
                    return (
                      <div
                        key={camp.id}
                        className="p-4 rounded-xl transition-all"
                        style={{ background: "#f5f5f7" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#ebebeb")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#f5f5f7")}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{typeIcons[camp.type]}</span>
                            <div>
                              <p className="text-sm font-medium" style={{ color: "#1d1d1f" }}>
                                {camp.name}
                              </p>
                              <p className="text-xs" style={{ color: "#8e8e93" }}>
                                {typeLabels[camp.type]}
                              </p>
                            </div>
                          </div>
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
                            style={{
                              background: statusColors[camp.status]?.bg,
                              color: statusColors[camp.status]?.text,
                            }}
                          >
                            {statusLabels[camp.status]}
                          </span>
                        </div>

                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1" style={{ color: "#8e8e93" }}>
                            <span>Presupuesto</span>
                            <span>€{camp.spent.toLocaleString()} / €{camp.budget.toLocaleString()} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#e0e0e0" }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(pct, 100)}%`,
                                background: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#0ea5e9",
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Impresiones", value: camp.impressions.toLocaleString() },
                            { label: "Clics", value: camp.clicks.toLocaleString() },
                            { label: "Conversiones", value: camp.conversions.toString() },
                          ].map((m) => (
                            <div
                              key={m.label}
                              className="rounded-lg p-2 text-center"
                              style={{ background: "rgba(255,255,255,0.7)" }}
                            >
                              <p className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>{m.value}</p>
                              <p className="text-xs" style={{ color: "#8e8e93" }}>{m.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Contact */}
            <div
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{
                background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
                border: "1px solid #dbeafe",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "#fff" }}
              >
                💬
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>
                  ¿Necesitas algo?
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6e6e73" }}>
                  Tu agencia está disponible.{" "}
                  <a href="mailto:admin@agencia.com" style={{ color: "#0ea5e9" }}>
                    Contáctanos
                  </a>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
