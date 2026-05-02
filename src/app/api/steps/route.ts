import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state") ?? "ALL";
    const voterType = searchParams.get("voter_type") ?? "ALL";

    const steps = await prisma.electionStep.findMany({
      where: {
        isActive: true,
        OR: [
          { state, voterType },
          { state: "ALL", voterType },
          { state, voterType: "ALL" },
          { state: "ALL", voterType: "ALL" },
        ],
      },
      orderBy: { stepNumber: "asc" },
    });

    return NextResponse.json({ steps });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch steps" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const step = await prisma.electionStep.create({ data: body });
    return NextResponse.json({ step }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create step" }, { status: 500 });
  }
}
