"use client";
import { useState, useEffect } from "react";

interface Phase {
  id: string; phaseKey: string; phaseNumber: number; title: string;
  shortDescription: string; fullDescription: string; authoritiesInvolved: string[];
  legalBasis?: string; realWorldExample?: string; colorHex: string;
}

export default function PhasesPage() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/phases")
      .then(r => r.json())
      .then(d => { setPhases(d.phases ?? []); setLoading(false); });
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <h1 className="section-heading gradient-text-blue">Election Phases Breakdown</h1>
        <p className="section-sub" style={{ margin: "0 auto" }}>Explore the 8 official phases of an Indian election cycle, from notification to results.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#8892b0" }}>Loading phases...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {phases.map((p) => {
            const isExpanded = expanded === p.id;
            return (
              <div
                key={p.id}
                className="glass glass-hover"
                style={{ padding: "24px", cursor: "pointer", position: "relative", overflow: "hidden" }}
                onClick={() => setExpanded(isExpanded ? null : p.id)}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: p.colorHex }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: `${p.colorHex}20`, display: "flex", alignItems: "center", justifyContent: "center", color: p.colorHex, fontWeight: 800, fontSize: "1.2rem" }}>
                    {p.phaseNumber}
                  </div>
                  <span style={{ color: "#8892b0", fontSize: "0.8rem", padding: "4px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 12 }}>Phase {p.phaseNumber}</span>
                </div>
                
                <h3 style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8, color: "#f0f4ff" }}>{p.title}</h3>
                <p style={{ color: "#8892b0", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: isExpanded ? 16 : 0 }}>
                  {p.shortDescription}
                </p>

                {isExpanded && (
                  <div className="animate-fade-up" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                    <p style={{ color: "#d1d5db", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 16 }}>{p.fullDescription}</p>
                    
                    {p.legalBasis && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: "0.75rem", color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Legal Basis</div>
                        <div style={{ fontSize: "0.85rem", color: "#8892b0", background: "rgba(255,255,255,0.03)", padding: "6px 10px", borderRadius: 6 }}>{p.legalBasis}</div>
                      </div>
                    )}
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: "0.75rem", color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Authorities Involved</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {p.authoritiesInvolved.map(a => (
                          <span key={a} style={{ fontSize: "0.75rem", color: "#a5b4fc", background: "rgba(99,102,241,0.1)", padding: "4px 8px", borderRadius: 12, border: "1px solid rgba(99,102,241,0.2)" }}>{a}</span>
                        ))}
                      </div>
                    </div>

                    {p.realWorldExample && (
                      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "12px", marginTop: 16 }}>
                        <div style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Real-World Example</div>
                        <div style={{ fontSize: "0.85rem", color: "#d1d5db", fontStyle: "italic" }}>"{p.realWorldExample}"</div>
                      </div>
                    )}
                  </div>
                )}
                
                <div style={{ textAlign: "center", marginTop: 16, color: "#8892b0", fontSize: "0.8rem", display: isExpanded ? "none" : "block" }}>
                  Click to expand ↓
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
