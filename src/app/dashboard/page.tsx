"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState<{ completed: number, total: number }>({ completed: 0, total: 0 });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      // Fetch user's overall progress across steps
      fetch("/api/progress").then(r => r.json()).then(d => {
        const completed = (d.progress ?? []).filter((p: any) => p.status === "completed").length;
        // Approximation for demo: we assume 7 steps for first_time, 4 for returning
        const isReturning = (session?.user as any)?.voterType === "returning";
        setProgress({ completed, total: isReturning ? 4 : 7 });
      });
    }
  }, [status, router, session]);

  if (status === "loading") return <div style={{ padding: 60, textAlign: "center" }}>Loading...</div>;
  if (!session) return null;

  const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
      <h1 className="section-heading gradient-text-blue" style={{ marginBottom: 8 }}>Welcome back, {session.user?.name}</h1>
      <p style={{ color: "#8892b0", marginBottom: 40 }}>Manage your election readiness profile.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {/* Profile Card */}
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Profile Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#8892b0" }}>Email</span>
              <span style={{ color: "#f0f4ff" }}>{session.user?.email}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#8892b0" }}>Account Type</span>
              <span style={{ color: "#f0f4ff", textTransform: "capitalize" }}>{(session.user as any)?.role || "Voter"}</span>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Voter Readiness</h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.9rem" }}>
            <span>Steps Completed</span>
            <span style={{ color: "#6366f1", fontWeight: 700 }}>{progress.completed} / {progress.total}</span>
          </div>
          <div className="progress-bar" style={{ marginBottom: 20 }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <Link href="/guide" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Continue Guide →
          </Link>
        </div>

        {/* Notifications Card */}
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Notifications</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#d1d5db", fontSize: "0.95rem" }}>Registration Reminders</span>
              <div style={{ width: 44, height: 24, background: "#6366f1", borderRadius: 12, position: "relative", cursor: "pointer" }}>
                <div style={{ width: 20, height: 20, background: "white", borderRadius: "50%", position: "absolute", top: 2, right: 2 }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#d1d5db", fontSize: "0.95rem" }}>Election Day Alerts</span>
              <div style={{ width: 44, height: 24, background: "#6366f1", borderRadius: 12, position: "relative", cursor: "pointer" }}>
                <div style={{ width: 20, height: 20, background: "white", borderRadius: "50%", position: "absolute", top: 2, right: 2 }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#8892b0", fontSize: "0.95rem" }}>Result Updates</span>
              <div style={{ width: 44, height: 24, background: "rgba(255,255,255,0.1)", borderRadius: 12, position: "relative", cursor: "pointer" }}>
                <div style={{ width: 20, height: 20, background: "#8892b0", borderRadius: "50%", position: "absolute", top: 2, left: 2 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
