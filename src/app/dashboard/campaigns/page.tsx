"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getCampaigns } from "@/lib/services/campaigns";
import type { Campaign } from "@/lib/database.types";

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

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaigns()
      .then(setCampaigns)
      .finally(() => setLoading(false));
  }, []);

  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const spentPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <DashboardLayout requiredRole="agency">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
            >
              Campañas
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#6e6e73" }}>
              Todas las campañas de tus clientes
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}
          >
            + Nueva Campaña
          </button>
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
                { label: "Presupuesto Total", value: `€${totalBudget.toLocaleString()}` },
                { label: "Invertido", value: `€${totalSpent.toLocaleString()}`, pct: spentPct },
                { label: "Clics Totales", value: totalClicks.toLocaleString() },
                { label: "Conversiones", value: totalConversions.toLocaleString() },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-5"
                  style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <p className="text-xs font-medium mb-2" style={{ color: "#6e6e73" }}>{s.label}</p>
                  <p className="text-xl font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                    {s.value}
                  </p>
                  {s.pct !== undefined && (
                    <div className="mt-2">
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "#f0f0f0" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.pct}%`,
                            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                          }}
                        />
                      </div>
                      <p className="text-xs mt-1" style={{ color: "#aeaeb2" }}>{s.pct}% usado</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Campaign cards */}
            {campaigns.length === 0 ? (
              <div
                className="rounded-2xl p-16 text-center"
                style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <p className="text-5xl mb-4">🚀</p>
                <p className="text-base font-semibold" style={{ color: "#1d1d1f" }}>
                  Sin campañas todavía
                </p>
                <p className="text-sm mt-2" style={{ color: "#6e6e73" }}>
                  Crea tu primera campaña con el botón de arriba
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((camp) => {
                  const pct = camp.budget > 0 ? Math.round((camp.spent / camp.budget) * 100) : 0;
                  const ctr = camp.impressions > 0
                    ? ((camp.clicks / camp.impressions) * 100).toFixed(2)
                    : "0";

                  return (
                    <div
                      key={camp.id}
                      className="rounded-2xl p-5 transition-all"
                      style={{
                        background: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)")}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                            style={{ background: "#f5f5f7" }}
                          >
                            {typeIcons[camp.type]}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>
                              {camp.name}
                            </h3>
                            <p className="text-xs" style={{ color: "#8e8e93" }}>
                              {camp.clientName} · {typeLabels[camp.type]}
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

                      {/* Budget bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1.5" style={{ color: "#8e8e93" }}>
                          <span>Presupuesto</span>
                          <span>€{camp.spent.toLocaleString()} / €{camp.budget.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#f0f0f0" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              background: pct >= 90
                                ? "#ef4444"
                                : pct >= 70
                                ? "#f59e0b"
                                : "linear-gradient(90deg, #6366f1, #8b5cf6)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Impresiones", value: camp.impressions.toLocaleString() },
                          { label: `Clics (CTR ${ctr}%)`, value: camp.clicks.toLocaleString() },
                          { label: "Conversiones", value: camp.conversions.toString() },
                        ].map((m) => (
                          <div
                            key={m.label}
                            className="rounded-xl p-3"
                            style={{ background: "#f5f5f7" }}
                          >
                            <p className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>{m.value}</p>
                            <p className="text-xs mt-0.5" style={{ color: "#8e8e93" }}>{m.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
