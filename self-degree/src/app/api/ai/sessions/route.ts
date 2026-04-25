import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, unauthorized, notFound } from "@/lib/auth";

/**
 * POST /api/ai/sessions
 * Protected — Log a new AI tutoring session for a child.
 * MVP stub: creates an AISession record.
 */
export async function POST(request: NextRequest) {
  console.log("[ai/sessions] POST called");

  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();

  const { childId, duration, tokensUsed, topic, summary } = await request.json();

  if (!childId) {
    return NextResponse.json({ error: "childId required" }, { status: 400 });
  }

  try {
    // Verify child belongs to user's family
    const child = await prisma.child.findFirst({
      where: { id: childId, family: { ownerUserId: user.id } },
    });

    if (!child) return notFound("Child not found");

    const session = await prisma.aISession.create({
      data: {
        childId,
        duration: duration ?? 0,
        tokensUsed: tokensUsed ?? 0,
        topic: topic ?? null,
        summary: summary ?? null,
      },
    });

    console.log("[ai/sessions] Session logged:", session.id);
    return NextResponse.json({ session }, { status: 201 });
  } catch (err) {
    console.error("[ai/sessions] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
