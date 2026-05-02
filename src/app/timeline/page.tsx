"use client";
import { useState, useEffect } from "react";
import { formatDate, getDaysUntil } from "@/lib/utils";

const STATES = ["NATIONAL", "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Karnataka", "Delhi"];

interface Phase {
  id: string; phaseName: string; phaseNumber: number;
  startDate: string; endDate: string; description?: string; isCurrent: boolean; officialUrl?: string;
}

function Countdown({ date }: { date: string }) {
  const [days, setDays] = useState(getDaysUntil(date));
  useEffect(() => {
    const t = setInterval(() => setDays(getDaysUntil(date)), 60000);
    return () => clearInterval(t);
  }, [date]);
  if (days < 0) return <span style={{ color: "#10b981", fontSize: "0.8rem" }}>✓ Completed</span>;
  if (days === 0) return <span style={{ color: "#f59e0b", fontSize: "0.8rem", fontWeight: 700 }}>Today!</span>;
  return <span style={{ color: "#a5b4fc", fontSize: "0.8rem" }}>{days}d remaining</span>;
}

export default function TimelinePage() {
  const [state, setState] = useState("NATIONAL");
  const [timeline, setTimeline] = useState<Phase[]>([]);
  const [selected, setSelected] = useState<Phase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/timeline?state=${state}&cycle=Lok Sabha 2024`)
      .then(r => r.json())
      .then(d => { setTimeline(d.timeline ?? []); setLoading(false); });
  }, [state]);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
      <h1 className="section-heading gradient-text-blue">Election Timeline</h1>
      <p className="section-sub" style={{ marginBottom: 36 }}>Track every phase of the election cycle with live countdowns.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
        {STATES.map(s => (
          <button key={s} onClick={() => setState(s)}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", borderColor: state === s ? "#6366f1" : "rgba(255,255,255,0.1)", background: state === s ? "rgba(99,102,241,0.2)" : "transparent", color: state === s ? "#a5b4fc" : "#8892b0", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#8892b0" }}>Loading timeline...</div>
      ) : (
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom, #6366f1, #8b5cf6)", opacity: 0.3 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingLeft: 56 }}>
            {timeline.map((phase, i) => (
              <div key={phase.id}>
                {/* Timeline dot */}
                <div style={{ position: "absolute", left: 8, width: 24, height: 24, borderRadius: "50%", background: phase.isCurrent ? "#6366f1" : "rgba(99,102,241,0.3)", border: `2px solid ${phase.isCurrent ? "#6366f1" : "rgba(99,102,241,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 16, boxShadow: phase.isCurrent ? "0 0 12px rgba(99,102,241,0.6)" : "none" }}>
                  {phase.isCurrent && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "white" }} />}
                </div>
                <div className={`glass glass-hover`} style={{ padding: "20px 24px", cursor: "pointer", borderColor: phase.isCurrent ? "rgba(99,102,241,0.4)" : undefined }} onClick={() => setSelected(selected?.id === phase.id ? null : phase)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      {phase.isCurrent && <span style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4, marginRight: 8 }}>CURRENT</span>}
                      <span style={{ fontWeight: 700, fontSize: "1rem" }}>Phase {phase.phaseNumber}: {phase.phaseName}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ color: "#8892b0", fontSize: "0.85rem" }}>{formatDate(phase.startDate)}</span>
                      <Countdown date={phase.endDate} />
                    </div>
                  </div>
                  {selected?.id === phase.id && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <p style={{ color: "#8892b0", lineHeight: 1.7, fontSize: "0.9rem" }}>{phase.description}</p>
                      {phase.officialUrl && <a href={phase.officialUrl} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: "0.85rem", fontWeight: 600, display: "block", marginTop: 12 }}>Official Source →</a>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
