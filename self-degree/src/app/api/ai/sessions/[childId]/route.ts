import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, unauthorized, notFound } from "@/lib/auth";

/**
 * GET /api/ai/sessions/:childId
 * Protected — Retrieve AI session history for a specific child.
 * MVP stub: returns all AISession records for the child.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { childId: string } }
) {
  console.log("[ai/sessions/:childId] GET called for child:", params.childId);

  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();

  try {
    const child = await prisma.child.findFirst({
      where: { id: params.childId, family: { ownerUserId: user.id } },
    });

    if (!child) return notFound("Child not found");

    const sessions = await prisma.aISession.findMany({
      where: { childId: params.childId },
      orderBy: { date: "desc" },
    });

    console.log("[ai/sessions/:childId] Returning", sessions.length, "sessions");
    return NextResponse.json({ sessions });
  } catch (err) {
    console.error("[ai/sessions/:childId] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
