import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const entry = await prisma.waitlistEntry.upsert({
      where: { email },
      update: {},
      create: {
        email,
        source: source ?? "website",
        status: "PENDING",
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    // Unique constraint violation is expected for duplicate emails
    return NextResponse.json({ message: "Already on the waitlist!" }, { status: 200 });
  }
}
