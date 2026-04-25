import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, unauthorized, notFound } from "@/lib/auth";

/**
 * GET /api/children/:id/projects
 * Protected — List all projects for a child.
 * MVP stub: returns Project[] from Prisma.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("[children/:id/projects] GET called for child:", params.id);

  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();

  const child = await prisma.child.findFirst({
    where: { id: params.id, family: { ownerUserId: user.id } },
  });

  if (!child) return notFound("Child not found");

  const projects = await prisma.project.findMany({
    where: { childId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
}

/**
 * POST /api/children/:id/projects
 * Protected — Create a new project for a child.
 * MVP stub: creates a Project record with status IDEATION.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("[children/:id/projects] POST called for child:", params.id);

  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();

  const child = await prisma.child.findFirst({
    where: { id: params.id, family: { ownerUserId: user.id } },
  });

  if (!child) return notFound("Child not found");

  const { name, description } = await request.json();

  if (!name || !description) {
    return NextResponse.json(
      { error: "name and description required" },
      { status: 400 }
    );
  }

  const project = await prisma.project.create({
    data: {
      childId: params.id,
      name,
      description,
      status: "IDEATION",
    },
  });

  console.log("[children/:id/projects] Project created:", project.id);
  return NextResponse.json({ project }, { status: 201 });
}
