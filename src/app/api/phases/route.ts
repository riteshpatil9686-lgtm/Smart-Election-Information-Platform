import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const phases = await prisma.electionPhase.findMany({
      orderBy: { phaseNumber: "asc" },
    });
    return NextResponse.json({ phases });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch phases" }, { status: 500 });
  }
}
