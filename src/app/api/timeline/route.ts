import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state") ?? "NATIONAL";
    const cycle = searchParams.get("cycle") ?? "Lok Sabha 2024";

    const timeline = await prisma.electionTimeline.findMany({
      where: { state, electionCycle: cycle },
      orderBy: { phaseNumber: "asc" },
    });

    const states = await prisma.electionTimeline.findMany({
      select: { state: true },
      distinct: ["state"],
    });

    return NextResponse.json({ timeline, states: states.map((s) => s.state) });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch timeline" }, { status: 500 });
  }
}
