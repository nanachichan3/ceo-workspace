import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

async function getUserFromAuth(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const child = await prisma.child.findFirst({
    where: { id: params.id, family: { ownerUserId: user.id } },
  });

  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const entries = await prisma.progressEntry.findMany({
    where: { childId: params.id },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ entries });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const child = await prisma.child.findFirst({
    where: { id: params.id, family: { ownerUserId: user.id } },
  });

  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const { type, subject, description, xpEarned } = body;

  if (!type || !description) {
    return NextResponse.json({ error: "type and description required" }, { status: 400 });
  }

  const entry = await prisma.progressEntry.create({
    data: {
      childId: params.id,
      type,
      subject: subject ?? null,
      description,
      xpEarned: xpEarned ?? 10,
    },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
