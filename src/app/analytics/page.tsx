"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface AnalyticsRow {
  id: string; state: string; year: number; electionType: string;
  eligibleVoters: string; registeredVoters: string; votesCast: string; turnoutPercentage: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState("ALL");
  const [states, setStates] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/analytics${state !== "ALL" ? `?state=${state}` : ""}`)
      .then(r => r.json())
      .then(d => {
        setData(d.data ?? []);
        if (state === "ALL") {
          const uniqueStates = Array.from(new Set((d.data ?? []).map((x: any) => x.state)));
          setStates(uniqueStates as string[]);
        }
        setLoading(false);
      });
  }, [state]);

  // Aggregate data for chart (if ALL, average turnout per year; if specific state, turnout per year)
  const chartData = [2014, 2019, 2024].map(year => {
    const yearData = data.filter(d => d.year === year);
    if (yearData.length === 0) return { year: year.toString(), turnout: 0 };
    const avgTurnout = yearData.reduce((acc, curr) => acc + curr.turnoutPercentage, 0) / yearData.length;
    return { year: year.toString(), turnout: parseFloat(avgTurnout.toFixed(2)) };
  });

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 className="section-heading gradient-text-blue">Election Analytics</h1>
        <p className="section-sub" style={{ margin: "0 auto" }}>Historical voter turnout data from Lok Sabha elections.</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <select className="input" style={{ maxWidth: 300 }} value={state} onChange={e => setState(e.target.value)}>
          <option value="ALL">All States (Average)</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#8892b0" }}>Loading data...</div>
      ) : (
        <div className="glass" style={{ padding: "32px", height: 400 }}>
          <h3 style={{ textAlign: "center", marginBottom: 24, fontWeight: 700, color: "#f0f4ff" }}>
            Voter Turnout (%) — {state === "ALL" ? "National Average" : state}
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="year" stroke="#8892b0" tick={{ fill: '#8892b0' }} />
              <YAxis stroke="#8892b0" tick={{ fill: '#8892b0' }} domain={[0, 100]} />
              <Tooltip 
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{ background: "#111827", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, color: "#f0f4ff" }} 
              />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Bar dataKey="turnout" name="Turnout %" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Raw Data Table */}
      <div className="glass" style={{ marginTop: 32, padding: "24px", overflowX: "auto" }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Raw Data</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
              <th style={{ padding: "12px 8px", color: "#8892b0", fontWeight: 600 }}>State</th>
              <th style={{ padding: "12px 8px", color: "#8892b0", fontWeight: 600 }}>Year</th>
              <th style={{ padding: "12px 8px", color: "#8892b0", fontWeight: 600 }}>Eligible Voters</th>
              <th style={{ padding: "12px 8px", color: "#8892b0", fontWeight: 600 }}>Turnout %</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 15).map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "12px 8px" }}>{row.state}</td>
                <td style={{ padding: "12px 8px" }}>{row.year}</td>
                <td style={{ padding: "12px 8px" }}>{parseInt(row.eligibleVoters).toLocaleString('en-IN')}</td>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: row.turnoutPercentage >= 65 ? "#10b981" : "#f59e0b" }}>{row.turnoutPercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
