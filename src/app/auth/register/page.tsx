"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", state: "", voterType: "first_time" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Minimal implementation for demo — in real app would call an API route to create user
    alert("In this prototype, please use Google OAuth or the seeded Admin account to login.");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="glass" style={{ width: "100%", maxWidth: 450, padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>Join VoteSmart</h1>
          <p style={{ color: "#8892b0", fontSize: "0.9rem" }}>Create your voter profile</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#8892b0", marginBottom: 6 }}>Full Name</label>
            <input required className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#8892b0", marginBottom: 6 }}>Email</label>
            <input type="email" required className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#8892b0", marginBottom: 6 }}>Password</label>
            <input type="password" required className="input" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: "center", marginTop: 8 }}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div style={{ position: "relative", margin: "24px 0", textAlign: "center" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ position: "relative", background: "#111827", padding: "0 12px", fontSize: "0.85rem", color: "#8892b0" }}>Or continue with</span>
        </div>

        <button 
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          style={{ width: "100%", padding: "12px", background: "white", color: "#333", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.9rem", color: "#8892b0" }}>
          Already have an account? <Link href="/auth/signin" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
