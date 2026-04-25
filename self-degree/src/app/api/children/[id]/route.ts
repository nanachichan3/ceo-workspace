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
    where: {
      id: params.id,
      family: { ownerUserId: user.id },
    },
    include: {
      progressEntries: { orderBy: { date: "desc" }, take: 20 },
      projects: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ child });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const child = await prisma.child.findFirst({
    where: { id: params.id, family: { ownerUserId: user.id } },
  });

  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.child.update({
    where: { id: params.id },
    data: {
      name: body.name,
      age: body.age ? parseInt(body.age) : undefined,
      learningProfile: body.learningProfile,
      avatarUrl: body.avatarUrl,
    },
  });

  return NextResponse.json({ child: updated });
}
