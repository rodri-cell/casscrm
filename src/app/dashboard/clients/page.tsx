"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_CLIENTS } from "@/lib/auth";

const statusColors = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  inactive: "bg-red-500/20 text-red-400 border-red-500/30",
  prospect: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const statusLabels = {
  active: "Activo",
  inactive: "Inactivo",
  prospect: "Prospecto",
};

export default function ClientsPage() {
  return (
    <DashboardLayout requiredRole="agency">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Clientes</h1>
            <p className="text-slate-400 mt-1">Gestiona todos tus clientes</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-purple-500/20">
            + Nuevo Cliente
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{MOCK_CLIENTS.filter(c => c.status === "active").length}</p>
            <p className="text-slate-400 text-sm mt-1">Activos</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{MOCK_CLIENTS.filter(c => c.status === "prospect").length}</p>
            <p className="text-slate-400 text-sm mt-1">Prospectos</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{MOCK_CLIENTS.filter(c => c.status === "inactive").length}</p>
            <p className="text-slate-400 text-sm mt-1">Inactivos</p>
          </div>
        </div>

        {/* Clients table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Cliente</th>
                  <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Empresa</th>
                  <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Estado</th>
                  <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Campañas</th>
                  <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Presupuesto/mes</th>
                  <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Desde</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MOCK_CLIENTS.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-300 font-bold text-sm flex-shrink-0">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{client.name}</p>
                          <p className="text-slate-400 text-xs">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{client.company}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[client.status]}`}>
                        {statusLabels[client.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{client.campaigns}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {client.monthlyBudget > 0 ? `€${client.monthlyBudget.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(client.joinedAt).toLocaleDateString("es-ES", { year: "numeric", month: "short" })}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-white text-sm transition">
                        Ver →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
