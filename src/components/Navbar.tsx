"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const navLinks = [
  { href: "/guide", label: "Voter Guide" },
  { href: "/timeline", label: "Timeline" },
  { href: "/eligibility", label: "Eligibility" },
  { href: "/phases", label: "Election Phases" },
  { href: "/booths", label: "Find Booth" },
  { href: "/analytics", label: "Analytics" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      background: "rgba(10,11,20,0.9)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #FF9933, #6366f1, #138808)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🗳️</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", background: "linear-gradient(135deg, #FF9933, #f0f4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VoteSmart India</span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="hide-mobile">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} style={{ color: "#8892b0", textDecoration: "none", padding: "6px 12px", borderRadius: 8, fontSize: "0.875rem", fontWeight: 500, transition: "all 0.2s" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "#f0f4ff"; (e.target as HTMLElement).style.background = "rgba(99,102,241,0.1)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "#8892b0"; (e.target as HTMLElement).style.background = "transparent"; }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {session ? (
            <>
              <Link href="/dashboard" style={{ color: "#f0f4ff", textDecoration: "none", padding: "8px 16px", borderRadius: 8, background: "rgba(99,102,241,0.15)", fontSize: "0.875rem", fontWeight: 600 }}>Dashboard</Link>
              <button onClick={() => signOut()} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#8892b0", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.875rem" }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" style={{ color: "#8892b0", textDecoration: "none", padding: "8px 16px", borderRadius: 8, fontSize: "0.875rem" }}>Sign In</Link>
              <Link href="/auth/register" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", padding: "8px 16px", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600 }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
