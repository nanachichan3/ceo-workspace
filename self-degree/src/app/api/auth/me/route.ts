import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, getUserWithFamily, unauthorized } from "@/lib/auth";

/**
 * GET /api/auth/me
 * Protected — Get the current authenticated user and their family data.
 * MVP stub: returns user + family + children from Prisma.
 */
export async function GET(request: NextRequest) {
  console.log("[auth/me] GET called");

  const authUser = await getUserFromRequest(request);
  if (!authUser) {
    console.log("[auth/me] Unauthorized");
    return unauthorized();
  }

  try {
    const user = await getUserWithFamily(authUser.id);

    if (!user) {
      console.log("[auth/me] User not found in DB:", authUser.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ownedFamily: _family, ...userPublic } = user;

    console.log("[auth/me] Returning user:", user.id);
    return NextResponse.json({
      user: userPublic,
      family: user.ownedFamily ?? null,
      children: user.ownedFamily?.children ?? [],
    });
  } catch (err) {
    console.error("[auth/me] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
