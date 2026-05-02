import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkEligibility } from "@/lib/eligibility-engine";

export async function POST(req: NextRequest) {
  try {
    const { age, isCitizen, isRegistered, isDisqualifiedByCourt, state } =
      await req.json();

    if (age === undefined || isCitizen === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rule = await prisma.eligibilityRule.findFirst({
      where: { OR: [{ region: state }, { region: "INDIA" }] },
      orderBy: { region: "asc" }, // prefer state-specific if available
    });

    if (!rule) {
      return NextResponse.json({ error: "Rules not found" }, { status: 404 });
    }

    const result = checkEligibility(
      { age: Number(age), isCitizen, isRegistered, isDisqualifiedByCourt, state },
      rule.rulesJson as any
    );

    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ error: "Eligibility check failed" }, { status: 500 });
  }
}
