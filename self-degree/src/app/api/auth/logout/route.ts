import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getUserFromRequest, unauthorized } from "@/lib/auth";

/**
 * POST /api/auth/logout
 * Protected — End the current session.
 * MVP stub: calls Supabase signOut.
 */
export async function POST(request: NextRequest) {
  console.log("[auth/logout] POST called");

  const user = await getUserFromRequest(request);
  if (!user) {
    console.log("[auth/logout] Unauthorized");
    return unauthorized();
  }

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[auth/logout] Supabase signOut error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("[auth/logout] User signed out:", user.id);
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("[auth/logout] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
