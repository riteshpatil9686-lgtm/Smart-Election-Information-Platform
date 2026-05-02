import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { haversineDistance } from "@/lib/haversine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") ?? "0");
    const lng = parseFloat(searchParams.get("lng") ?? "0");
    const radius = parseFloat(searchParams.get("radius") ?? "10");
    const accessible = searchParams.get("accessible");
    const state = searchParams.get("state");

    const where: any = {};
    if (state) where.state = state;
    if (accessible === "true") where.isWheelchairAccessible = true;

    const all = await prisma.pollingStation.findMany({ where });

    const withDistance = all
      .map((booth) => ({
        ...booth,
        distanceKm: lat && lng
          ? haversineDistance(lat, lng, booth.latitude, booth.longitude)
          : null,
      }))
      .filter((b) => !lat || !lng || !radius || (b.distanceKm ?? 0) <= radius)
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
      .slice(0, 50);

    return NextResponse.json({ booths: withDistance });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch booths" }, { status: 500 });
  }
}
