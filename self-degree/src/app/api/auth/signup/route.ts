import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/signup
 * Public — Register a new parent account via Supabase Auth.
 * MVP stub: creates Supabase user + seeds a Prisma User record.
 */
export async function POST(request: NextRequest) {
  console.log("[auth/signup] POST called");

  const { email, name, password } = await request.json();

  if (!email || !email.includes("@")) {
    console.log("[auth/signup] Invalid email:", email);
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  try {
    // Create auth user in Supabase
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password: password ?? undefined,
      options: {
        data: { name: name ?? "" },
      },
    });

    if (authError) {
      console.error("[auth/signup] Supabase error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authUser.user) {
      return NextResponse.json({ error: "Signup failed" }, { status: 500 });
    }

    // Seed Prisma User record
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: name ?? undefined },
      create: {
        id: authUser.user.id,
        email,
        name: name ?? null,
        role: "PARENT",
      },
    });

    console.log("[auth/signup] User created:", user.id);
    return NextResponse.json({ user, session: authUser.session }, { status: 201 });
  } catch (err) {
    console.error("[auth/signup] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
