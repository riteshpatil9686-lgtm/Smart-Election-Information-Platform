import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ stepId: string }> }
) {
  const { stepId } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { status } = await req.json();
    const progress = await prisma.userStepProgress.upsert({
      where: { userId_stepId: { userId: session.user.id, stepId: stepId } },
      update: {
        status,
        completedAt: status === "completed" ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        stepId: stepId,
        status,
        completedAt: status === "completed" ? new Date() : null,
      },
    });
    return NextResponse.json({ progress });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const progress = await prisma.userStepProgress.findMany({
      where: { userId: session.user.id },
    });
    return NextResponse.json({ progress });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
