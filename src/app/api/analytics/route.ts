import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const year = searchParams.get("year");
    const type = searchParams.get("type");

    const where: any = {};
    if (state) where.state = state;
    if (year) where.year = parseInt(year);
    if (type) where.electionType = type;

    const data = await prisma.analyticsData.findMany({
      where,
      orderBy: [{ year: "desc" }, { state: "asc" }],
    });

    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
