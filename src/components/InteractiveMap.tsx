"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in leaflet with Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

interface Booth {
  id: string; name: string; address: string; state: string; district: string;
  latitude: number; longitude: number; isWheelchairAccessible: boolean;
  boothNumber: string; totalVoters: number; distanceKm?: number;
}

export default function InteractiveMap({ booths, userLoc }: { booths: Booth[], userLoc: {lat: number, lng: number} | null }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{ height: 400, background: "rgba(255,255,255,0.05)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Map...</div>;
  }

  const defaultCenter: [number, number] = userLoc ? [userLoc.lat, userLoc.lng] : [28.6139, 77.2090]; // Default to New Delhi

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "16px", overflow: "hidden" }}>
      <MapContainer center={defaultCenter} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLoc && (
          <Marker position={[userLoc.lat, userLoc.lng]} icon={icon}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {booths.map((booth) => (
          <Marker key={booth.id} position={[booth.latitude, booth.longitude]} icon={icon}>
            <Popup>
              <div style={{ padding: "4px" }}>
                <h4 style={{ fontWeight: "bold", marginBottom: "4px", margin: 0, color: "#1f2937" }}>{booth.name}</h4>
                <p style={{ fontSize: "12px", color: "#4b5563", margin: "0 0 8px" }}>{booth.address}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "11px", background: "#e0e7ff", color: "#3730a3", padding: "2px 6px", borderRadius: "4px" }}>Booth: {booth.boothNumber}</span>
                  {booth.isWheelchairAccessible && <span style={{ fontSize: "11px", background: "#d1fae5", color: "#065f46", padding: "2px 6px", borderRadius: "4px" }}>♿ Accessible</span>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
