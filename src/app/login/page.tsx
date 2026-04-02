"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]   = useState("");
  const [pw,       setPw]      = useState("");
  const [error,    setError]   = useState("");
  const [loading,  setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pw,
      });
      if (authError) {
        setError(authError.message);
      } else {
        router.push("/companies/ikingdom/leads");
        router.refresh();
      }
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', monospace" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 380, padding: "48px 40px", border: "1px solid rgba(212,175,55,0.15)", background: "#080808" }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ margin: "0 0 8px", fontSize: 9, letterSpacing: "0.45em", color: "rgba(212,175,55,0.4)", textTransform: "uppercase" }}>
            iKingdom · Sistema interno
          </p>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#D4AF37", letterSpacing: "-0.02em" }}>
            Acceso
          </h1>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Contraseña</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {error && (
          <p style={{ margin: "0 0 16px", fontSize: 12, color: "#ff6b6b" }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", background: loading ? "rgba(212,175,55,0.3)" : "#D4AF37", color: "#000", border: "none", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
          {loading ? "Verificando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 10, letterSpacing: "0.25em",
  color: "rgba(212,175,55,0.5)", textTransform: "uppercase", marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  display: "block", width: "100%", padding: "12px 14px",
  background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.2)",
  color: "#D4AF37", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
};
