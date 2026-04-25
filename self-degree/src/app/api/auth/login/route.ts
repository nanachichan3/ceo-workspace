import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * POST /api/auth/login
 * Public — Trigger a magic link (passwordless) login email via Supabase.
 * MVP stub: accepts email and sends a magic link.
 */
export async function POST(request: NextRequest) {
  console.log("[auth/login] POST called");

  const { email } = await request.json();

  if (!email || !email.includes("@")) {
    console.log("[auth/login] Invalid email:", email);
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  try {
    const redirectTo = `${request.nextUrl.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      console.error("[auth/login] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("[auth/login] Magic link sent to:", email);
    return NextResponse.json({
      message: "Check your email for the login link",
      email,
    });
  } catch (err) {
    console.error("[auth/login] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
