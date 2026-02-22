"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getClientByProfileId } from "@/lib/services/clients";
import { getCampaignsByClientId } from "@/lib/services/campaigns";
import type { Client, Campaign } from "@/lib/database.types";

export default function ClientReportsPage() {
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

  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);

  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";
  const avgCPC = totalClicks > 0 ? (totalSpent / totalClicks).toFixed(2) : "0";
  const avgCPA = totalConversions > 0 ? (totalSpent / totalConversions).toFixed(2) : "0";
  const budgetUsedPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <DashboardLayout requiredRole="client">
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-2xl font-semibold"
            style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
          >
            Mis Informes
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6e6e73" }}>
            {clientData?.company ?? user?.company} · Rendimiento acumulado
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
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Impresiones", value: totalImpressions.toLocaleString(), icon: "👁️" },
                { label: "Clics", value: totalClicks.toLocaleString(), icon: "🖱️" },
                { label: "Conversiones", value: totalConversions.toString(), icon: "🎯" },
                { label: "Total Invertido", value: `€${totalSpent.toLocaleString()}`, icon: "💸" },
              ].map((k) => (
                <div
                  key={k.label}
                  className="rounded-2xl p-5"
                  style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium" style={{ color: "#6e6e73" }}>{k.label}</p>
                    <span className="text-xl">{k.icon}</span>
                  </div>
                  <p className="text-2xl font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                    {k.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Budget overview */}
            <div
              className="rounded-2xl p-6 mb-6"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <h2 className="text-sm font-semibold mb-4" style={{ color: "#1d1d1f" }}>
                Uso del Presupuesto
              </h2>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: "#6e6e73" }}>
                  €{totalSpent.toLocaleString()} de €{totalBudget.toLocaleString()}
                </span>
                <span className="font-semibold" style={{ color: "#1d1d1f" }}>{budgetUsedPct}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "#f0f0f0" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(budgetUsedPct, 100)}%`,
                    background: budgetUsedPct >= 90
                      ? "#ef4444"
                      : budgetUsedPct >= 70
                      ? "#f59e0b"
                      : "#0ea5e9",
                  }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: "#aeaeb2" }}>
                Restante: €{(totalBudget - totalSpent).toLocaleString()}
              </p>
            </div>

            {/* Ratios */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "CTR Medio", value: `${avgCTR}%`, sub: "Clics / Impresiones" },
                { label: "CPC Medio", value: `€${avgCPC}`, sub: "Coste por clic" },
                { label: "CPA Medio", value: `€${avgCPA}`, sub: "Coste por conversión" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="rounded-2xl p-5 text-center"
                  style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <p className="text-xs font-medium mb-3" style={{ color: "#6e6e73" }}>{r.label}</p>
                  <p
                    className="text-3xl font-semibold"
                    style={{ color: "#1d1d1f", letterSpacing: "-0.03em" }}
                  >
                    {r.value}
                  </p>
                  <p className="text-xs mt-2" style={{ color: "#aeaeb2" }}>{r.sub}</p>
                </div>
              ))}
            </div>

            {/* Per-campaign table */}
            {campaigns.length > 0 && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <div className="px-6 py-4" style={{ borderBottom: "1px solid #f5f5f7" }}>
                  <h2 className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>
                    Desglose por Campaña
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #f5f5f7" }}>
                        {["Campaña", "Impresiones", "Clics", "CTR", "Conversiones", "Invertido"].map((h, i) => (
                          <th
                            key={h}
                            className={`px-6 py-3 text-xs font-semibold uppercase tracking-wide ${i === 0 ? "text-left" : "text-right"}`}
                            style={{ color: "#aeaeb2" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c, i) => {
                        const ctr = c.impressions > 0
                          ? ((c.clicks / c.impressions) * 100).toFixed(2)
                          : "0";
                        return (
                          <tr
                            key={c.id}
                            style={{ borderBottom: i < campaigns.length - 1 ? "1px solid #f5f5f7" : "none" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1d1d1f" }}>
                              {c.name}
                            </td>
                            <td className="px-6 py-4 text-right text-sm" style={{ color: "#3a3a3c" }}>
                              {c.impressions.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-sm" style={{ color: "#3a3a3c" }}>
                              {c.clicks.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-sm" style={{ color: "#3a3a3c" }}>
                              {ctr}%
                            </td>
                            <td className="px-6 py-4 text-right text-sm" style={{ color: "#3a3a3c" }}>
                              {c.conversions}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium" style={{ color: "#1d1d1f" }}>
                              €{c.spent.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
