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

export async function GET(request: NextRequest) {
  const user = await getUserFromAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const family = await prisma.family.findFirst({
    where: { ownerUserId: user.id },
    include: {
      children: {
        include: {
          _count: { select: { progressEntries: true, projects: true } },
        },
      },
    },
  });

  return NextResponse.json({ children: family?.children ?? [] });
}

export async function POST(request: NextRequest) {
  const user = await getUserFromAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, age } = body;

  if (!name || !age) {
    return NextResponse.json({ error: "name and age are required" }, { status: 400 });
  }

  // Get or create family
  let family = await prisma.family.findFirst({
    where: { ownerUserId: user.id },
  });

  if (!family) {
    family = await prisma.family.create({
      data: {
        name: `${user.user_metadata?.name || "My"} Family`,
        ownerUserId: user.id,
      },
    });
  }

  const child = await prisma.child.create({
    data: {
      familyId: family.id,
      name,
      age: parseInt(age),
    },
  });

  return NextResponse.json({ child }, { status: 201 });
}
