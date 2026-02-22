"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getClientCampaigns, MOCK_CLIENTS } from "@/lib/auth";

export default function ClientReportsPage() {
  const { user } = useAuth();
  const campaigns = user ? getClientCampaigns(user.id) : [];
  const clientData = MOCK_CLIENTS.find((c) => c.id === user?.id);

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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Mis Informes</h1>
          <p className="text-slate-400 mt-1">
            {clientData?.company} · Rendimiento acumulado de todas tus campañas
          </p>
        </div>

        {/* Main KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Impresiones" value={totalImpressions.toLocaleString()} icon="👁️" color="blue" />
          <KpiCard label="Clics" value={totalClicks.toLocaleString()} icon="🖱️" color="purple" />
          <KpiCard label="Conversiones" value={totalConversions.toString()} icon="🎯" color="emerald" />
          <KpiCard label="Total Invertido" value={`€${totalSpent.toLocaleString()}`} icon="💸" color="orange" />
        </div>

        {/* Budget overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Uso del Presupuesto</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">€{totalSpent.toLocaleString()} invertidos de €{totalBudget.toLocaleString()} totales</span>
            <span className="text-white font-medium">{budgetUsedPct}%</span>
          </div>
          <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${budgetUsedPct >= 90 ? "bg-red-500" : budgetUsedPct >= 70 ? "bg-yellow-500" : "bg-blue-500"}`}
              style={{ width: `${Math.min(budgetUsedPct, 100)}%` }}
            />
          </div>
          <p className="text-slate-500 text-xs mt-2">
            Restante: €{(totalBudget - totalSpent).toLocaleString()}
          </p>
        </div>

        {/* Ratios */}
        <div className="grid grid-cols-3 gap-4 mb-6">
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

        {/* Per-campaign breakdown */}
        {campaigns.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h2 className="text-white font-semibold">Desglose por Campaña</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Campaña</th>
                    <th className="text-right px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Impresiones</th>
                    <th className="text-right px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Clics</th>
                    <th className="text-right px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">CTR</th>
                    <th className="text-right px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Conversiones</th>
                    <th className="text-right px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Invertido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {campaigns.map((c) => {
                    const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0";
                    return (
                      <tr key={c.id} className="hover:bg-slate-800/30 transition">
                        <td className="px-6 py-4 text-white text-sm font-medium">{c.name}</td>
                        <td className="px-6 py-4 text-right text-slate-300 text-sm">{c.impressions.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-slate-300 text-sm">{c.clicks.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-slate-300 text-sm">{ctr}%</td>
                        <td className="px-6 py-4 text-right text-slate-300 text-sm">{c.conversions}</td>
                        <td className="px-6 py-4 text-right text-slate-300 text-sm">€{c.spent.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function KpiCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: "blue" | "purple" | "emerald" | "orange";
}) {
  const colorMap = {
    blue: "bg-blue-500/10 border-blue-500/20",
    purple: "bg-purple-500/10 border-purple-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    orange: "bg-orange-500/10 border-orange-500/20",
  };

  return (
    <div className={`${colorMap[color]} border rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-400 text-sm">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}
