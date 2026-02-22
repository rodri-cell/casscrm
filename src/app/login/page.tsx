"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    if (user.role === "agency") {
      router.replace("/dashboard");
    } else {
      router.replace("/portal");
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      const stored = JSON.parse(localStorage.getItem("crm_auth_user") || "{}");
      if (stored.role === "agency") {
        router.push("/dashboard");
      } else {
        router.push("/portal");
      }
    } else {
      setError("Email o contraseña incorrectos. Prueba con los datos de demo.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Marketing Pro</h1>
          <p className="text-slate-400 mt-1">Plataforma de gestión de clientes</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition shadow-lg shadow-purple-500/20"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wide">Cuentas de demo</p>
            <div className="space-y-2">
              <button
                onClick={() => { setEmail("admin@agencia.com"); setPassword("demo"); }}
                className="w-full text-left px-3 py-2 bg-slate-700/40 hover:bg-slate-700 rounded-lg transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <div>
                    <p className="text-xs font-medium text-slate-200 group-hover:text-white">Agencia (Admin)</p>
                    <p className="text-xs text-slate-400">admin@agencia.com</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => { setEmail("ana@empresa.com"); setPassword("demo"); }}
                className="w-full text-left px-3 py-2 bg-slate-700/40 hover:bg-slate-700 rounded-lg transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <div>
                    <p className="text-xs font-medium text-slate-200 group-hover:text-white">Cliente — Ana García</p>
                    <p className="text-xs text-slate-400">ana@empresa.com</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => { setEmail("roberto@tienda.com"); setPassword("demo"); }}
                className="w-full text-left px-3 py-2 bg-slate-700/40 hover:bg-slate-700 rounded-lg transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <div>
                    <p className="text-xs font-medium text-slate-200 group-hover:text-white">Cliente — Roberto López</p>
                    <p className="text-xs text-slate-400">roberto@tienda.com</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
