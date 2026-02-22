"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === "agency" ? "/dashboard" : "/portal");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const success = await login(email, password);
    if (!success) {
      setError("Email o contraseña incorrectos.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f5f5f7" }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(145deg, #f0f4ff 0%, #fafafa 50%, #f5f0ff 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="fixed top-0 left-0 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)",
          transform: "translate(-30%, -30%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)",
          transform: "translate(30%, 30%)",
          filter: "blur(60px)",
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 8px 32px rgba(99, 102, 241, 0.35)",
            }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
          >
            Marketing Pro
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: "#6e6e73" }}>
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 2px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#1d1d1f" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#f5f5f7",
                  border: "1.5px solid transparent",
                  color: "#1d1d1f",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1.5px solid #6366f1";
                  e.target.style.background = "#fff";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1.5px solid transparent";
                  e.target.style.background = "#f5f5f7";
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#1d1d1f" }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#f5f5f7",
                  border: "1.5px solid transparent",
                  color: "#1d1d1f",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1.5px solid #6366f1";
                  e.target.style.background = "#fff";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1.5px solid transparent";
                  e.target.style.background = "#f5f5f7";
                }}
              />
            </div>

            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{ background: "#fff1f0", color: "#c0392b", border: "1px solid #fecaca" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2"
              style={{
                background: submitting
                  ? "#a5b4fc"
                  : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: submitting ? "none" : "0 4px 16px rgba(99,102,241,0.35)",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs" style={{ color: "#aeaeb2" }}>
            ¿Problemas para acceder? Contacta con tu administrador.
          </p>
        </div>
      </div>
    </div>
  );
}
