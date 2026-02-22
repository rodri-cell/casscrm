"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { MOCK_CLIENTS, getClientCampaigns } from "@/lib/auth";

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

export default function ClientPortal() {
  const { user } = useAuth();

  const clientData = MOCK_CLIENTS.find((c) => c.id === user?.id);
  const campaigns = user ? getClientCampaigns(user.id) : [];

  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);

  return (
    <DashboardLayout requiredRole="client">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Hola, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            {clientData?.company} · Resumen de tus campañas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
            <p className="text-slate-400 text-sm mb-1">Campañas Activas</p>
            <p className="text-white text-2xl font-bold">{activeCampaigns.length}</p>
            <p className="text-slate-500 text-xs mt-1">de {campaigns.length} totales</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5">
            <p className="text-slate-400 text-sm mb-1">Presupuesto Mensual</p>
            <p className="text-white text-2xl font-bold">€{clientData?.monthlyBudget.toLocaleString() ?? 0}</p>
            <p className="text-slate-500 text-xs mt-1">acordado con la agencia</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
            <p className="text-slate-400 text-sm mb-1">Clics Totales</p>
            <p className="text-white text-2xl font-bold">{totalClicks.toLocaleString()}</p>
            <p className="text-slate-500 text-xs mt-1">en todas las campañas</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5">
            <p className="text-slate-400 text-sm mb-1">Conversiones</p>
            <p className="text-white text-2xl font-bold">{totalConversions}</p>
            <p className="text-slate-500 text-xs mt-1">€{totalSpent.toLocaleString()} invertidos</p>
          </div>
        </div>

        {/* Campaigns */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Mis Campañas</h2>
            <a href="/portal/campaigns" className="text-blue-400 hover:text-blue-300 text-sm transition">
              Ver detalle →
            </a>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🚀</p>
              <p className="text-slate-400">Aún no tienes campañas activas.</p>
              <p className="text-slate-500 text-sm mt-1">Contacta con tu agencia para empezar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((camp) => {
                const pct = Math.round((camp.spent / camp.budget) * 100);
                return (
                  <div key={camp.id} className="p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{typeIcons[camp.type]}</span>
                        <div>
                          <p className="text-white text-sm font-medium">{camp.name}</p>
                          <p className="text-slate-400 text-xs">{typeLabels[camp.type]}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${statusColors[camp.status]}`}>
                        {statusLabels[camp.status]}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Presupuesto</span>
                        <span>€{camp.spent.toLocaleString()} / €{camp.budget.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-blue-500"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-slate-700/40 rounded-lg p-2">
                        <p className="text-white text-sm font-semibold">{camp.impressions.toLocaleString()}</p>
                        <p className="text-slate-400 text-xs">Impresiones</p>
                      </div>
                      <div className="bg-slate-700/40 rounded-lg p-2">
                        <p className="text-white text-sm font-semibold">{camp.clicks.toLocaleString()}</p>
                        <p className="text-slate-400 text-xs">Clics</p>
                      </div>
                      <div className="bg-slate-700/40 rounded-lg p-2">
                        <p className="text-white text-sm font-semibold">{camp.conversions}</p>
                        <p className="text-slate-400 text-xs">Conversiones</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact agency */}
        <div className="mt-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              💬
            </div>
            <div>
              <h3 className="text-white font-semibold">¿Necesitas algo?</h3>
              <p className="text-slate-400 text-sm mt-0.5">
                Tu agencia está disponible para ayudarte. Escríbenos a{" "}
                <a href="mailto:admin@agencia.com" className="text-blue-400 hover:underline">
                  admin@agencia.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
