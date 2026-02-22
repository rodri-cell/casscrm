"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getClientCampaigns } from "@/lib/auth";

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

export default function ClientCampaignsPage() {
  const { user } = useAuth();
  const campaigns = user ? getClientCampaigns(user.id) : [];

  return (
    <DashboardLayout requiredRole="client">
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-2xl font-semibold"
            style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
          >
            Mis Campañas
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6e6e73" }}>
            Detalle de todas tus campañas de marketing
          </p>
        </div>

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
              Contacta con tu agencia para comenzar
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((camp) => {
              const pct = Math.round((camp.spent / camp.budget) * 100);
              const ctr = camp.impressions > 0
                ? ((camp.clicks / camp.impressions) * 100).toFixed(2)
                : "0";
              const cpa = camp.conversions > 0
                ? (camp.spent / camp.conversions).toFixed(2)
                : null;

              return (
                <div
                  key={camp.id}
                  className="rounded-2xl p-6 transition-all"
                  style={{
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)")}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: "#f5f5f7" }}
                      >
                        {typeIcons[camp.type]}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold" style={{ color: "#1d1d1f" }}>
                          {camp.name}
                        </h3>
                        <p className="text-xs" style={{ color: "#8e8e93" }}>
                          {typeLabels[camp.type]}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium flex-shrink-0"
                      style={{
                        background: statusColors[camp.status]?.bg,
                        color: statusColors[camp.status]?.text,
                      }}
                    >
                      {statusLabels[camp.status]}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex gap-4 mb-4 text-xs" style={{ color: "#8e8e93" }}>
                    <span>📅 Inicio: {new Date(camp.startDate).toLocaleDateString("es-ES")}</span>
                    {camp.endDate && (
                      <span>🏁 Fin: {new Date(camp.endDate).toLocaleDateString("es-ES")}</span>
                    )}
                  </div>

                  {/* Budget */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs mb-1.5" style={{ color: "#8e8e93" }}>
                      <span>Presupuesto utilizado</span>
                      <span className="font-medium" style={{ color: "#1d1d1f" }}>
                        €{camp.spent.toLocaleString()} / €{camp.budget.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "#f0f0f0" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(pct, 100)}%`,
                          background: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#0ea5e9",
                        }}
                      />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Impresiones", value: camp.impressions.toLocaleString() },
                      { label: "Clics", value: camp.clicks.toLocaleString() },
                      { label: "CTR", value: `${ctr}%` },
                      { label: "Conversiones", value: camp.conversions.toString() },
                      { label: "Invertido", value: `€${camp.spent.toLocaleString()}` },
                      { label: "Presupuesto", value: `€${camp.budget.toLocaleString()}` },
                      { label: "CPA", value: cpa ? `€${cpa}` : "—" },
                      { label: "Restante", value: `€${(camp.budget - camp.spent).toLocaleString()}` },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl p-3 text-center"
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
      </div>
    </DashboardLayout>
  );
}
