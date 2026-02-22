"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_CLIENTS } from "@/lib/auth";

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "#d1fae5", text: "#065f46" },
  inactive: { bg: "#fee2e2", text: "#991b1b" },
  prospect: { bg: "#ede9fe", text: "#5b21b6" },
};

const statusLabels: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
  prospect: "Prospecto",
};

export default function ClientsPage() {
  const active = MOCK_CLIENTS.filter((c) => c.status === "active").length;
  const prospects = MOCK_CLIENTS.filter((c) => c.status === "prospect").length;
  const inactive = MOCK_CLIENTS.filter((c) => c.status === "inactive").length;

  return (
    <DashboardLayout requiredRole="agency">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
            >
              Clientes
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#6e6e73" }}>
              Gestiona todos tus clientes
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}
          >
            + Nuevo Cliente
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Activos", value: active, color: "#10b981", bg: "#d1fae5" },
            { label: "Prospectos", value: prospects, color: "#8b5cf6", bg: "#ede9fe" },
            { label: "Inactivos", value: inactive, color: "#ef4444", bg: "#fee2e2" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-5 text-center"
              style={{
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <p
                className="text-3xl font-semibold"
                style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
              >
                {s.value}
              </p>
              <p className="text-xs mt-1 font-medium" style={{ color: "#6e6e73" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                  {["Cliente", "Empresa", "Estado", "Campañas", "Presupuesto/mes", "Desde", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "#aeaeb2" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_CLIENTS.map((client, i) => (
                  <tr
                    key={client.id}
                    style={{
                      borderBottom: i < MOCK_CLIENTS.length - 1 ? "1px solid #f5f5f7" : "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: "#ede9fe", color: "#6366f1" }}
                        >
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "#1d1d1f" }}>
                            {client.name}
                          </p>
                          <p className="text-xs" style={{ color: "#aeaeb2" }}>
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#3a3a3c" }}>
                      {client.company}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: statusColors[client.status]?.bg,
                          color: statusColors[client.status]?.text,
                        }}
                      >
                        {statusLabels[client.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#3a3a3c" }}>
                      {client.campaigns}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1d1d1f" }}>
                      {client.monthlyBudget > 0 ? `€${client.monthlyBudget.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#8e8e93" }}>
                      {new Date(client.joinedAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-xs font-medium transition-colors"
                        style={{ color: "#6366f1" }}
                      >
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
