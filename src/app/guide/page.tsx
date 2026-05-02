"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const VOTER_TYPES = ["first_time", "returning", "nri"];
const STATES = ["ALL", "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Karnataka", "Delhi", "Rajasthan", "West Bengal", "Gujarat", "Bihar", "Kerala"];

interface Step {
  id: string; stepNumber: number; title: string; description: string;
  officialUrl?: string; deadlineLabel?: string; deadlineDate?: string;
}

export default function GuidePage() {
  const { data: session } = useSession();
  const [state, setState] = useState("ALL");
  const [voterType, setVoterType] = useState("first_time");
  const [steps, setSteps] = useState<Step[]>([]);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/steps?state=${state}&voter_type=${voterType}`)
      .then(r => r.json())
      .then(d => { setSteps(d.steps ?? []); setLoading(false); });
  }, [state, voterType]);

  useEffect(() => {
    if (session) {
      fetch("/api/progress").then(r => r.json()).then(d => {
        const map: Record<string, string> = {};
        (d.progress ?? []).forEach((p: any) => { map[p.stepId] = p.status; });
        setProgress(map);
      });
    }
  }, [session]);

  const toggleStep = async (stepId: string) => {
    if (!session) return;
    const newStatus = progress[stepId] === "completed" ? "pending" : "completed";
    setProgress(prev => ({ ...prev, [stepId]: newStatus }));
    await fetch(`/api/progress/${stepId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const completed = steps.filter(s => progress[s.id] === "completed").length;
  const pct = steps.length ? Math.round((completed / steps.length) * 100) : 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 className="section-heading gradient-text-blue">Step-by-Step Voter Guide</h1>
      <p className="section-sub" style={{ marginBottom: 36 }}>Your personalised election guide based on your state and voter type.</p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        <select className="input" style={{ width: "auto", minWidth: 200 }} value={state} onChange={e => setState(e.target.value)} aria-label="Select state">
          {STATES.map(s => <option key={s} value={s}>{s === "ALL" ? "🇮🇳 All States (National)" : s}</option>)}
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          {VOTER_TYPES.map(t => (
            <button key={t} onClick={() => setVoterType(t)}
              style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid", borderColor: voterType === t ? "#6366f1" : "rgba(255,255,255,0.1)", background: voterType === t ? "rgba(99,102,241,0.2)" : "transparent", color: voterType === t ? "#a5b4fc" : "#8892b0", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", textTransform: "capitalize" }}>
              {t.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {session && steps.length > 0 && (
        <div className="glass" style={{ padding: 20, marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: "0.9rem" }}>
            <span style={{ fontWeight: 600 }}>Your Progress</span>
            <span style={{ color: "#6366f1" }}>{completed} of {steps.length} steps — {pct}%</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
        </div>
      )}

      {/* Steps */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#8892b0" }}>Loading steps...</div>
      ) : steps.length === 0 ? (
        <div className="glass" style={{ padding: 40, textAlign: "center", color: "#8892b0" }}>No steps found for this selection.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {steps.map((step, i) => {
            const done = progress[step.id] === "completed";
            return (
              <div key={step.id} className="glass" style={{ padding: "24px", borderLeft: `3px solid ${done ? "#10b981" : "#6366f1"}`, opacity: done ? 0.8 : 1, transition: "all 0.3s" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: done ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.2)", border: `1px solid ${done ? "#10b981" : "#6366f1"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: done ? "#10b981" : "#6366f1", flexShrink: 0 }}>
                    {done ? "✓" : step.stepNumber}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <h3 style={{ fontWeight: 700, fontSize: "1rem", textDecoration: done ? "line-through" : "none", color: done ? "#8892b0" : "#f0f4ff" }}>{step.title}</h3>
                      {step.deadlineLabel && <span style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 6, padding: "2px 10px", fontSize: "0.75rem" }}>⏱ {step.deadlineLabel}</span>}
                    </div>
                    <p style={{ color: "#8892b0", fontSize: "0.9rem", lineHeight: 1.6, marginTop: 6 }}>{step.description}</p>
                    <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                      {step.officialUrl && <a href={step.officialUrl} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: "0.85rem", fontWeight: 600 }}>Official Link →</a>}
                      {session && (
                        <button onClick={() => toggleStep(step.id)} style={{ background: done ? "rgba(16,185,129,0.1)" : "rgba(99,102,241,0.1)", border: `1px solid ${done ? "#10b981" : "#6366f1"}`, color: done ? "#10b981" : "#6366f1", borderRadius: 6, padding: "4px 14px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                          {done ? "✓ Completed" : "Mark Done"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!session && <p style={{ textAlign: "center", color: "#8892b0", marginTop: 24, fontSize: "0.9rem" }}>Sign in to track your progress across steps.</p>}
    </div>
  );
}
