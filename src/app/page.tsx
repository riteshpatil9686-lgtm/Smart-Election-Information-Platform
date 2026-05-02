import Link from "next/link";

const features = [
  { icon: "🗺️", title: "Voter Guide", desc: "Step-by-step voting process tailored to your profile", href: "/guide", color: "#6366f1" },
  { icon: "📅", title: "Election Timeline", desc: "Live countdown to every phase with interactive details", href: "/timeline", color: "#f59e0b" },
  { icon: "✅", title: "Eligibility Checker", desc: "Instant rule-based check — find out if you can vote", href: "/eligibility", color: "#10b981" },
  { icon: "⚖️", title: "Election Phases", desc: "Interactive breakdown of all 8 ECI election phases", href: "/phases", color: "#ec4899" },
  { icon: "📍", title: "Find Your Booth", desc: "Real map with your nearest polling stations", href: "/booths", color: "#3b82f6" },
  { icon: "📊", title: "Analytics", desc: "Voter turnout trends from 2014–2024 Lok Sabha", href: "/analytics", color: "#8b5cf6" },
];

const stats = [
  { value: "96.8 Cr", label: "Registered Voters" },
  { value: "543", label: "Lok Sabha Seats" },
  { value: "10.5 Lakh", label: "Polling Stations" },
  { value: "66.14%", label: "2024 Turnout" },
];

export default function HomePage() {
  return (
    <div className="hero-gradient">
      {/* Hero */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px 80px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 999, padding: "6px 16px", marginBottom: 24, fontSize: "0.85rem", color: "#a5b4fc" }}>
          🇮🇳 Official ECI-aligned information platform for Indian voters
        </div>
        <h1 className="section-heading gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", marginBottom: 24 }}>
          India's Smartest<br />Election Information Platform
        </h1>
        <p style={{ color: "#8892b0", fontSize: "1.15rem", lineHeight: 1.7, maxWidth: 620, margin: "0 auto 40px" }}>
          From voter registration to results — everything you need to participate in Indian democracy. Powered by real ECI data and AI assistance.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/eligibility" className="btn-primary">Check Eligibility ✅</Link>
          <Link href="/guide" className="btn-secondary">Voter Guide →</Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 80, maxWidth: 800, margin: "80px auto 0" }}>
          {stats.map((s) => (
            <div key={s.label} className="glass" style={{ padding: "24px 16px", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, background: "linear-gradient(135deg, #FF9933, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
              <div style={{ color: "#8892b0", fontSize: "0.8rem", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>Everything You Need to Vote</h2>
        <p style={{ textAlign: "center", color: "#8892b0", marginBottom: 48 }}>12 integrated modules — all your election needs in one place</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f) => (
            <Link key={f.href} href={f.href} style={{ textDecoration: "none" }}>
              <div className="glass glass-hover" style={{ padding: "28px", cursor: "pointer" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}20`, border: `1px solid ${f.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, color: "#f0f4ff" }}>{f.title}</h3>
                <p style={{ color: "#8892b0", fontSize: "0.9rem", lineHeight: 1.6 }}>{f.desc}</p>
                <div style={{ marginTop: 16, color: f.color, fontSize: "0.85rem", fontWeight: 600 }}>Explore →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 24, padding: "60px 40px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>Got Questions? Ask Our AI Assistant</h2>
          <p style={{ color: "#8892b0", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>Powered by Claude — get instant, accurate answers about voter registration, booths, documents, and more.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {["Where is my polling booth?", "Am I eligible to vote?", "What ID do I need?"].map(q => (
              <span key={q} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "8px 16px", fontSize: "0.85rem", color: "#a5b4fc" }}>{q}</span>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 24px", textAlign: "center", color: "#8892b0", fontSize: "0.85rem" }}>
        <p>Data sourced from ECI — <a href="https://eci.gov.in" style={{ color: "#6366f1" }}>eci.gov.in</a> | Not an official ECI website</p>
      </footer>
    </div>
  );
}
