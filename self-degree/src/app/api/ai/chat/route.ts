import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { generateContent, SELF_DEGREE_TUTOR_PROMPT, type GeminiMessage } from "@/lib/gemini";

async function getUserFromAuth(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function POST(request: NextRequest) {
  const user = await getUserFromAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { childId, message, history } = await request.json();

  if (!childId || !message) {
    return NextResponse.json({ error: "childId and message required" }, { status: 400 });
  }

  // Verify child belongs to user's family
  const child = await prisma.child.findFirst({
    where: { id: childId, family: { ownerUserId: user.id } },
  });

  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const startTime = Date.now();

  // Build conversation context
  const conversationHistory = (history ?? [])
    .slice(-10) // last 10 messages for context window
    .map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      content: m.content,
    }));

  const contextPrompt = `The child's name is ${child.name}, age ${child.age}. ` +
    (child.learningProfile
      ? `Learning profile: ${JSON.stringify(child.learningProfile)}. `
      : "") +
    `The child is working with an AI tutor on the Self-Degree framework. ` +
    `Follow the child's lead. Be curious, ask questions, generate challenges.`;

  try {
    const allMessages: GeminiMessage[] = [
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const response = await generateContent(allMessages, {
      systemPrompt: `${SELF_DEGREE_TUTOR_PROMPT}\n\n${contextPrompt}`,
      temperature: 0.8,
    });

    const duration = Math.round((Date.now() - startTime) / 1000);

    // Log session
    await prisma.aISession.create({
      data: {
        childId,
        duration,
        tokensUsed: Math.round(message.length / 4 + response.length / 4), // rough estimate
        topic: message.slice(0, 50),
        summary: response.slice(0, 200),
      },
    });

    return NextResponse.json({ response });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json({ error: "AI response failed" }, { status: 500 });
  }
}
