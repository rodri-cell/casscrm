"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getClientCampaigns } from "@/lib/auth";

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

export default function ClientCampaignsPage() {
  const { user } = useAuth();
  const campaigns = user ? getClientCampaigns(user.id) : [];

  return (
    <DashboardLayout requiredRole="client">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Mis Campañas</h1>
          <p className="text-slate-400 mt-1">Detalle de todas tus campañas de marketing</p>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
            <p className="text-5xl mb-4">🚀</p>
            <p className="text-white font-semibold text-lg">Sin campañas todavía</p>
            <p className="text-slate-400 mt-2">Contacta con tu agencia para comenzar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((camp) => {
              const pct = Math.round((camp.spent / camp.budget) * 100);
              const ctr = camp.impressions > 0 ? ((camp.clicks / camp.impressions) * 100).toFixed(2) : "0";
              const cpa = camp.conversions > 0 ? (camp.spent / camp.conversions).toFixed(2) : "—";

              return (
                <div key={camp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl">
                        {typeIcons[camp.type]}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{camp.name}</h3>
                        <p className="text-slate-400 text-sm">{typeLabels[camp.type]}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border flex-shrink-0 ${statusColors[camp.status]}`}>
                      {statusLabels[camp.status]}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex gap-4 mb-5 text-sm text-slate-400">
                    <span>📅 Inicio: {new Date(camp.startDate).toLocaleDateString("es-ES")}</span>
                    {camp.endDate && (
                      <span>🏁 Fin: {new Date(camp.endDate).toLocaleDateString("es-ES")}</span>
                    )}
                  </div>

                  {/* Budget */}
                  <div className="mb-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Presupuesto utilizado</span>
                      <span className="text-white font-medium">
                        €{camp.spent.toLocaleString()} / €{camp.budget.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-blue-500"}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <MetricBox label="Impresiones" value={camp.impressions.toLocaleString()} />
                    <MetricBox label="Clics" value={camp.clicks.toLocaleString()} />
                    <MetricBox label={`CTR`} value={`${ctr}%`} />
                    <MetricBox label="Conversiones" value={camp.conversions.toString()} />
                    <MetricBox label="Invertido" value={`€${camp.spent.toLocaleString()}`} />
                    <MetricBox label="Presupuesto" value={`€${camp.budget.toLocaleString()}`} />
                    <MetricBox label="CPA" value={cpa !== "—" ? `€${cpa}` : "—"} />
                    <MetricBox label="Restante" value={`€${(camp.budget - camp.spent).toLocaleString()}`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-3 text-center">
      <p className="text-white text-base font-semibold">{value}</p>
      <p className="text-slate-400 text-xs mt-0.5">{label}</p>
    </div>
  );
}
