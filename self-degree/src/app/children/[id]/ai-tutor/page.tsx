"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Child {
  id: string;
  name: string;
  age: number;
}

export default function AITutorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [child, setChild] = useState<Child | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    getSupabase()
      .auth.getSession()
      .then(async ({ data: { session } }) => {
        if (!session) {
          router.push("/auth/login");
          return;
        }
        setUser(session.user);

        const res = await fetch(`/api/children/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setChild(data.child);
        } else {
          router.push("/dashboard");
        }
        setLoading(false);
      });
  }, [id, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);
    setTokensUsed(null);

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const {
        data: { session },
      } = await getSupabase().auth.getSession();
      if (!session) return;

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          childId: id,
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        setTokensUsed(data.tokensUsed);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Something went wrong. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-gold-500">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-navy-900 flex flex-col">
      <header className="border-b border-navy-700 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/children/${id}`} className="text-gold-500 font-bold text-lg">
              Self-Degree
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">
              {child?.name} — AI Tutor
            </span>
          </div>
          <Link
            href={`/children/${id}`}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Progress
          </Link>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-5xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Hi, {child?.name}! I'm your AI tutor.
            </h2>
            <p className="text-gray-400 text-center max-w-md leading-relaxed">
              I'm here to follow your curiosity, not to teach you things. Ask me anything, tell me
              what you're exploring, or let me know if you'd like a challenge!
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gold-500 text-navy-900"
                      : "bg-navy-800 border border-navy-700 text-gray-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Tokens indicator */}
        {tokensUsed !== null && (
          <div className="px-6 py-2 text-center text-xs text-gray-500">
            Used {tokensUsed.toLocaleString()} tokens
          </div>
        )}

        {/* Input bar */}
        <div className="flex-shrink-0 border-t border-navy-700 px-6 py-4">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${child?.name ?? "your AI tutor"}...`}
              disabled={sending}
              className="flex-1 px-4 py-3 bg-navy-800 border border-navy-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="px-6 py-3 bg-gold-500 text-navy-900 font-semibold rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50"
            >
              {sending ? "..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
