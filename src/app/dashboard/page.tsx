"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_CLIENTS, MOCK_CAMPAIGNS } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

const statusColors = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  paused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  draft: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  inactive: "bg-red-500/20 text-red-400 border-red-500/30",
  prospect: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const statusLabels = {
  active: "Activo",
  paused: "Pausado",
  completed: "Completado",
  draft: "Borrador",
  inactive: "Inactivo",
  prospect: "Prospecto",
};

const typeLabels = {
  social: "Redes Sociales",
  email: "Email",
  seo: "SEO",
  ppc: "PPC",
  content: "Contenido",
};

export default function AgencyDashboard() {
  const { user } = useAuth();

  const activeClients = MOCK_CLIENTS.filter((c) => c.status === "active").length;
  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "active").length;
  const totalBudget = MOCK_CLIENTS.reduce((sum, c) => sum + c.monthlyBudget, 0);
  const totalSpent = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.spent, 0);
  const totalConversions = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.conversions, 0);

  const recentCampaigns = MOCK_CAMPAIGNS.slice(0, 4);

  return (
    <DashboardLayout requiredRole="agency">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Bienvenido, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">Aquí tienes el resumen de tu agencia</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Clientes Activos"
            value={activeClients}
            icon="👥"
            color="purple"
            sub={`de ${MOCK_CLIENTS.length} totales`}
          />
          <StatCard
            label="Campañas Activas"
            value={activeCampaigns}
            icon="🚀"
            color="blue"
            sub={`de ${MOCK_CAMPAIGNS.length} totales`}
          />
          <StatCard
            label="Presupuesto Mensual"
            value={`€${totalBudget.toLocaleString()}`}
            icon="💰"
            color="emerald"
            sub="suma de todos los clientes"
          />
          <StatCard
            label="Conversiones"
            value={totalConversions}
            icon="🎯"
            color="orange"
            sub={`€${totalSpent.toLocaleString()} invertidos`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Campaigns */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Campañas Recientes</h2>
              <a href="/dashboard/campaigns" className="text-purple-400 hover:text-purple-300 text-sm transition">
                Ver todas →
              </a>
            </div>
            <div className="space-y-3">
              {recentCampaigns.map((camp) => (
                <div key={camp.id} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{camp.name}</p>
                    <p className="text-slate-400 text-xs">{camp.clientName} · {typeLabels[camp.type]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">€{camp.spent.toLocaleString()}</p>
                    <p className="text-slate-400 text-xs">de €{camp.budget.toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[camp.status]}`}>
                    {statusLabels[camp.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Client List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Clientes</h2>
              <a href="/dashboard/clients" className="text-purple-400 hover:text-purple-300 text-sm transition">
                Ver todos →
              </a>
            </div>
            <div className="space-y-3">
              {MOCK_CLIENTS.map((client) => (
                <div key={client.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/50 transition">
                  <div className="w-9 h-9 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-300 font-bold text-sm flex-shrink-0">
                    {client.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{client.name}</p>
                    <p className="text-slate-400 text-xs truncate">{client.company}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[client.status]}`}>
                    {statusLabels[client.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: "purple" | "blue" | "emerald" | "orange";
  sub: string;
}) {
  const colorMap = {
    purple: "bg-purple-500/10 border-purple-500/20",
    blue: "bg-blue-500/10 border-blue-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    orange: "bg-orange-500/10 border-orange-500/20",
  };

  return (
    <div className={`${colorMap[color]} border rounded-2xl p-5`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-slate-400 text-sm">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
      <p className="text-slate-500 text-xs mt-1">{sub}</p>
    </div>
  );
}
