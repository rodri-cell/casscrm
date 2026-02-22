"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_CAMPAIGNS, MOCK_CLIENTS } from "@/lib/auth";

export default function ReportsPage() {
  const totalImpressions = MOCK_CAMPAIGNS.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = MOCK_CAMPAIGNS.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = MOCK_CAMPAIGNS.reduce((s, c) => s + c.conversions, 0);
  const totalSpent = MOCK_CAMPAIGNS.reduce((s, c) => s + c.spent, 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";
  const avgCPC = totalClicks > 0 ? (totalSpent / totalClicks).toFixed(2) : "0";
  const avgCPA = totalConversions > 0 ? (totalSpent / totalConversions).toFixed(2) : "0";

  // Per-client summary
  const clientSummary = MOCK_CLIENTS.map((client) => {
    const camps = MOCK_CAMPAIGNS.filter((c) => c.clientId === client.id);
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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Informes</h1>
          <p className="text-slate-400 mt-1">Rendimiento global de todas las campañas</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Impresiones" value={totalImpressions.toLocaleString()} icon="👁️" />
          <KpiCard label="Clics" value={totalClicks.toLocaleString()} icon="🖱️" />
          <KpiCard label="Conversiones" value={totalConversions.toLocaleString()} icon="🎯" />
          <KpiCard label="Invertido" value={`€${totalSpent.toLocaleString()}`} icon="💸" />
        </div>

        {/* Ratios */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-slate-400 text-sm mb-2">CTR Medio</p>
            <p className="text-white text-3xl font-bold">{avgCTR}%</p>
            <p className="text-slate-500 text-xs mt-1">Clics / Impresiones</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-slate-400 text-sm mb-2">CPC Medio</p>
            <p className="text-white text-3xl font-bold">€{avgCPC}</p>
            <p className="text-slate-500 text-xs mt-1">Coste por clic</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-slate-400 text-sm mb-2">CPA Medio</p>
            <p className="text-white text-3xl font-bold">€{avgCPA}</p>
            <p className="text-slate-500 text-xs mt-1">Coste por conversión</p>
          </div>
        </div>

        {/* Per-client table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-white font-semibold">Rendimiento por Cliente</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Cliente</th>
                  <th className="text-right px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Impresiones</th>
                  <th className="text-right px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Clics</th>
                  <th className="text-right px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Conversiones</th>
                  <th className="text-right px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Invertido</th>
                  <th className="text-right px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {clientSummary.map((c) => {
                  const ctr = c.totalImpressions > 0 ? ((c.totalClicks / c.totalImpressions) * 100).toFixed(2) : "0";
                  return (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium">{c.name}</p>
                        <p className="text-slate-400 text-xs">{c.company}</p>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-300 text-sm">{c.totalImpressions.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-slate-300 text-sm">{c.totalClicks.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-slate-300 text-sm">{c.totalConversions}</td>
                      <td className="px-6 py-4 text-right text-slate-300 text-sm">€{c.totalSpent.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-slate-300 text-sm">{ctr}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function KpiCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-400 text-sm">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}
