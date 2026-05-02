"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => <div style={{ height: 400, background: "rgba(255,255,255,0.05)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Map...</div>
});

// For this project without full Leaflet/maps setup due to constraints, we'll build a custom list-based view with distance calculation.
// If actual map is needed, we'd wrap react-leaflet components here.

interface Booth {
  id: string; name: string; address: string; state: string; district: string;
  latitude: number; longitude: number; isWheelchairAccessible: boolean;
  boothNumber: string; totalVoters: number; distanceKm?: number;
}

export default function BoothsPage() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [radius, setRadius] = useState(50);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);

  const fetchBooths = async (lat?: number, lng?: number) => {
    setLoading(true);
    let url = "/api/booths?";
    if (lat && lng) url += `lat=${lat}&lng=${lng}&radius=${radius}&`;
    if (accessibleOnly) url += "accessible=true";
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      setBooths(data.booths ?? []);
    } catch {
      console.error("Failed to fetch booths");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooths(userLoc?.lat, userLoc?.lng); }, [radius, accessibleOnly, userLoc]);

  const getLocation = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        () => {
          alert("Could not get location. Falling back to default list.");
          setLocating(false);
          fetchBooths();
        }
      );
    } else {
      setLocating(false);
      fetchBooths();
    }
  };


  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 className="section-heading gradient-text-blue">Find Your Polling Booth</h1>
        <p className="section-sub" style={{ margin: "0 auto" }}>Locate your designated ECI polling station and get directions.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 32 }}>
        {/* Sidebar */}
        <div className="glass" style={{ padding: "24px", height: "fit-content" }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Filters</h3>
          
          <button 
            className="btn-primary" 
            onClick={getLocation} 
            disabled={locating}
            style={{ width: "100%", justifyContent: "center", marginBottom: 24 }}
          >
            {locating ? "Locating..." : "📍 Use My Location"}
          </button>

          {userLoc && (
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#8892b0", marginBottom: 8 }}>Search Radius: {radius}km</label>
              <input 
                type="range" min="1" max="100" value={radius} 
                onChange={e => setRadius(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#6366f1" }}
              />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input 
              type="checkbox" id="access" checked={accessibleOnly}
              onChange={e => setAccessibleOnly(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "#6366f1" }}
            />
            <label htmlFor="access" style={{ fontSize: "0.9rem", color: "#d1d5db" }}>Wheelchair Accessible Only</label>
          </div>
        </div>

        {/* Results list */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Results ({booths.length})</h2>
            {userLoc && <span style={{ color: "#10b981", fontSize: "0.85rem" }}>✓ Sorted by distance</span>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <InteractiveMap booths={booths} userLoc={userLoc} />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#8892b0" }}>Searching...</div>
          ) : booths.length === 0 ? (
            <div className="glass" style={{ padding: 60, textAlign: "center", color: "#8892b0" }}>
              No polling booths found matching your criteria.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {booths.map(b => (
                <div key={b.id} className="glass glass-hover" style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#f0f4ff", marginBottom: 4 }}>{b.name}</h3>
                      <p style={{ color: "#8892b0", fontSize: "0.9rem", marginBottom: 8 }}>{b.address}</p>
                      
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 6, fontSize: "0.8rem", color: "#a5b4fc" }}>Booth: {b.boothNumber}</span>
                        {b.isWheelchairAccessible && <span style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "4px 10px", borderRadius: 6, fontSize: "0.8rem" }}>♿ Accessible</span>}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: "right" }}>
                      {b.distanceKm !== undefined && b.distanceKm !== null && (
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#6366f1", marginBottom: 8 }}>
                          {b.distanceKm < 1 ? "< 1" : b.distanceKm.toFixed(1)} km
                        </div>
                      )}
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}`} 
                        target="_blank" rel="noreferrer"
                        className="btn-primary"
                        style={{ padding: "8px 16px", fontSize: "0.8rem" }}
                      >
                        Directions ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
