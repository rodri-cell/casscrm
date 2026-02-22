"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getCampaigns } from "@/lib/services/campaigns";
import { getClients } from "@/lib/services/clients";
import type { Campaign, Client } from "@/lib/database.types";

export default function ReportsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCampaigns(), getClients()])
      .then(([camp, cl]) => {
        setCampaigns(camp);
        setClients(cl);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";
  const avgCPC = totalClicks > 0 ? (totalSpent / totalClicks).toFixed(2) : "0";
  const avgCPA = totalConversions > 0 ? (totalSpent / totalConversions).toFixed(2) : "0";

  const clientSummary = clients.map((client) => {
    const camps = campaigns.filter((c) => c.clientId === client.id);
    return {
      ...client,
      totalSpent: camps.reduce((s, c) => s + c.spent, 0),
      totalImpressions: camps.reduce((s, c) => s + c.impressions, 0),
      totalClicks: camps.reduce((s, c) => s + c.clicks, 0),
      totalConversions: camps.reduce((s, c) => s + c.conversions, 0),
    };
  });

  return (
    <DashboardLayout requiredRole="agency">
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-2xl font-semibold"
            style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
          >
            Informes
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6e6e73" }}>
            Rendimiento global de todas las campañas
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
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Impresiones", value: totalImpressions.toLocaleString(), icon: "👁️" },
                { label: "Clics", value: totalClicks.toLocaleString(), icon: "🖱️" },
                { label: "Conversiones", value: totalConversions.toLocaleString(), icon: "🎯" },
                { label: "Invertido", value: `€${totalSpent.toLocaleString()}`, icon: "💸" },
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

            {/* Ratios */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "CTR Medio", value: `${avgCTR}%`, sub: "Clics / Impresiones" },
                { label: "CPC Medio", value: `€${avgCPC}`, sub: "Coste por clic" },
                { label: "CPA Medio", value: `€${avgCPA}`, sub: "Coste por conversión" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="rounded-2xl p-6 text-center"
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

            {/* Per-client table */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="px-6 py-4" style={{ borderBottom: "1px solid #f5f5f7" }}>
                <h2 className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>
                  Rendimiento por Cliente
                </h2>
              </div>
              {clientSummary.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm" style={{ color: "#aeaeb2" }}>Sin datos todavía</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #f5f5f7" }}>
                        {["Cliente", "Impresiones", "Clics", "Conversiones", "Invertido", "CTR"].map((h, i) => (
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
                      {clientSummary.map((c, i) => {
                        const ctr = c.totalImpressions > 0
                          ? ((c.totalClicks / c.totalImpressions) * 100).toFixed(2)
                          : "0";
                        return (
                          <tr
                            key={c.id}
                            style={{ borderBottom: i < clientSummary.length - 1 ? "1px solid #f5f5f7" : "none" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium" style={{ color: "#1d1d1f" }}>{c.name}</p>
                              <p className="text-xs" style={{ color: "#aeaeb2" }}>{c.company}</p>
                            </td>
                            <td className="px-6 py-4 text-right text-sm" style={{ color: "#3a3a3c" }}>
                              {c.totalImpressions.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-sm" style={{ color: "#3a3a3c" }}>
                              {c.totalClicks.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-sm" style={{ color: "#3a3a3c" }}>
                              {c.totalConversions}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium" style={{ color: "#1d1d1f" }}>
                              €{c.totalSpent.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-sm" style={{ color: "#3a3a3c" }}>
                              {ctr}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
