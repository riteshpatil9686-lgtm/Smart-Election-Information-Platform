"use client";
import { useState } from "react";

const STATES = ["INDIA", "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Karnataka", "Delhi", "Rajasthan"];

interface Result {
  eligible: boolean;
  reasons: string[];
  actionSteps: string[];
  registrationUrl: string;
}

export default function EligibilityPage() {
  const [form, setForm] = useState({ age: "", isCitizen: true, isRegistered: false, isDisqualifiedByCourt: false, state: "INDIA" });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    if (!form.age) { setError("Please enter your age."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/eligibility/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: parseInt(form.age) }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); } else { setResult(data.result); }
    } catch { setError("Check failed. Please try again."); }
    finally { setLoading(false); }
  };

  const field = (label: string, content: React.ReactNode) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", color: "#8892b0", fontSize: "0.85rem", marginBottom: 6, fontWeight: 600 }}>{label}</label>
      {content}
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <h1 className="section-heading gradient-text-blue">Eligibility Checker</h1>
      <p className="section-sub" style={{ marginBottom: 40 }}>Find out instantly if you're eligible to vote in India — powered by the official ECI rule engine.</p>

      <div className="glass" style={{ padding: "36px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {field("Your Age *", <input type="number" className="input" placeholder="e.g. 22" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} aria-label="Age" />)}
          {field("State of Residence", (
            <select className="input" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} aria-label="State">
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ))}
        </div>

        {[
          { key: "isCitizen", label: "I am an Indian citizen" },
          { key: "isRegistered", label: "I am already registered as a voter" },
          { key: "isDisqualifiedByCourt", label: "I have been disqualified by a court order" },
        ].map(({ key, label }) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <input type="checkbox" id={key} checked={form[key as keyof typeof form] as boolean}
              onChange={e => setForm({ ...form, [key]: e.target.checked })}
              style={{ width: 18, height: 18, accentColor: "#6366f1" }} />
            <label htmlFor={key} style={{ color: "#d1d5db", fontSize: "0.95rem", cursor: "pointer" }}>{label}</label>
          </div>
        ))}

        {error && <p style={{ color: "#f87171", marginBottom: 16, fontSize: "0.9rem" }}>⚠ {error}</p>}

        <button className="btn-primary" onClick={check} disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
          {loading ? "Checking..." : "Check My Eligibility →"}
        </button>
      </div>

      {result && (
        <div className="glass" style={{ marginTop: 24, padding: 32, borderColor: result.eligible ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)", borderWidth: 1, borderStyle: "solid" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: result.eligible ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              {result.eligible ? "✅" : "❌"}
            </div>
            <div>
              <div className={result.eligible ? "badge-eligible" : "badge-ineligible"} style={{ display: "inline-block" }}>
                {result.eligible ? "ELIGIBLE TO VOTE" : "NOT ELIGIBLE"}
              </div>
            </div>
          </div>

          {result.reasons.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12, color: "#f87171" }}>Reasons:</h3>
              {result.reasons.map((r, i) => <div key={i} style={{ color: "#8892b0", marginBottom: 6, fontSize: "0.9rem" }}>• {r}</div>)}
            </div>
          )}

          {result.actionSteps.length > 0 && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 12, color: "#fbbf24" }}>Action Steps:</h3>
              {result.actionSteps.map((s, i) => <div key={i} style={{ color: "#8892b0", marginBottom: 8, fontSize: "0.9rem" }}>→ {s}</div>)}
              <a href={result.registrationUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: 20, display: "inline-flex" }}>
                Register Now at voters.eci.gov.in →
              </a>
            </div>
          )}

          {result.eligible && (
            <div style={{ marginTop: 16, padding: 16, background: "rgba(16,185,129,0.05)", borderRadius: 10 }}>
              <p style={{ color: "#4ade80", fontWeight: 600, marginBottom: 4 }}>🎉 You are eligible to vote!</p>
              <p style={{ color: "#8892b0", fontSize: "0.9rem" }}>Accepted IDs at booth: Voter ID, Aadhaar, PAN Card, Passport, MNREGA Job Card, Bank Passbook with Photo.</p>
            </div>
          )}
        </div>
      )}

      {/* Info box */}
      <div className="glass" style={{ marginTop: 24, padding: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>📋 General Voter Eligibility (India)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Minimum Age", "18 years"], ["Citizenship", "Indian only"], ["Registration Deadline", "25 days before election"], ["Accepted IDs", "6 document types"]].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ color: "#8892b0", fontSize: "0.75rem", marginBottom: 4 }}>{k}</div>
              <div style={{ fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
