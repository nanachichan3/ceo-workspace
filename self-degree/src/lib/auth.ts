import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

/**
 * Extract and validate the current user from a Supabase JWT session.
 * Used by all protected API routes.
 */
export async function getUserFromRequest(
  request: NextRequest
): Promise<{ id: string; email: string } | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return null;
  return { id: user.id, email: user.email ?? "" };
}

/**
 * Return a JSON 401 response for unauthorized requests.
 */
export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Return a JSON 404 response for resource-not-found requests.
 */
export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * Fetch the full User + Family record for the authenticated user.
 * Returns null if the user has no family yet (new signup).
 */
export async function getUserWithFamily(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      ownedFamily: {
        include: {
          children: {
            include: {
              _count: { select: { progressEntries: true, projects: true } },
            },
          },
        },
      },
    },
  });
}
