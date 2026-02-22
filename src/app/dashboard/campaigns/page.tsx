"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_CAMPAIGNS } from "@/lib/auth";

const statusColors = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  paused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  draft: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const statusLabels = {
  active: "Activo",
  paused: "Pausado",
  completed: "Completado",
  draft: "Borrador",
};

const typeIcons = {
  social: "📱",
  email: "📧",
  seo: "🔍",
  ppc: "💰",
  content: "✍️",
};

const typeLabels = {
  social: "Redes Sociales",
  email: "Email Marketing",
  seo: "SEO",
  ppc: "PPC / Ads",
  content: "Contenido",
};

export default function CampaignsPage() {
  const totalBudget = MOCK_CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
  const totalSpent = MOCK_CAMPAIGNS.reduce((s, c) => s + c.spent, 0);
  const totalClicks = MOCK_CAMPAIGNS.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = MOCK_CAMPAIGNS.reduce((s, c) => s + c.conversions, 0);

  return (
    <DashboardLayout requiredRole="agency">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Campañas</h1>
            <p className="text-slate-400 mt-1">Todas las campañas de tus clientes</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-purple-500/20">
            + Nueva Campaña
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-1">Presupuesto Total</p>
            <p className="text-white text-xl font-bold">€{totalBudget.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-1">Invertido</p>
            <p className="text-white text-xl font-bold">€{totalSpent.toLocaleString()}</p>
            <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${Math.round((totalSpent / totalBudget) * 100)}%` }}
              />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-1">Clics Totales</p>
            <p className="text-white text-xl font-bold">{totalClicks.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-1">Conversiones</p>
            <p className="text-white text-xl font-bold">{totalConversions.toLocaleString()}</p>
          </div>
        </div>

        {/* Campaigns list */}
        <div className="space-y-3">
          {MOCK_CAMPAIGNS.map((camp) => {
            const pct = Math.round((camp.spent / camp.budget) * 100);
            const ctr = camp.impressions > 0 ? ((camp.clicks / camp.impressions) * 100).toFixed(2) : "0";
            return (
              <div key={camp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{typeIcons[camp.type]}</span>
                    <div>
                      <h3 className="text-white font-semibold">{camp.name}</h3>
                      <p className="text-slate-400 text-sm">{camp.clientName} · {typeLabels[camp.type]}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${statusColors[camp.status]}`}>
                    {statusLabels[camp.status]}
                  </span>
                </div>

                {/* Budget bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Presupuesto usado</span>
                    <span>€{camp.spent.toLocaleString()} / €{camp.budget.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-purple-500"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-400 text-xs">Impresiones</p>
                    <p className="text-white text-sm font-medium">{camp.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Clics (CTR {ctr}%)</p>
                    <p className="text-white text-sm font-medium">{camp.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Conversiones</p>
                    <p className="text-white text-sm font-medium">{camp.conversions}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
