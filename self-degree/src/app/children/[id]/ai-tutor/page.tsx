"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}

interface Message {
  role: "user" | "model";
  content: string;
}

export default function AITutorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [child, setChild] = useState<{ name: string; age: number } | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Hi there! I'm your AI tutor on the Self-Degree framework. I'm here to follow your curiosity — not to test you or lecture you. What are you curious about today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { session: authSession },
      } = await getSupabase().auth.getSession();

      if (!authSession) {
        router.push("/auth/login");
        return;
      }

      setSession(authSession as { access_token: string });

      // Load child info
      const res = await fetch(`/api/children/${id}`, {
        headers: { Authorization: `Bearer ${authSession.access_token}` },
      });

      if (!res.ok) {
        router.push("/dashboard");
        return;
      }

      const data = await res.json();
      setChild(data.child);
    }
    load();
  }, [id, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading || !session) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          childId: id,
          message: userMessage,
          history: messages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "model", content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: "I'm having trouble responding right now. Can you try again?" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "I'm having trouble responding right now. Can you try again?" },
      ]);
    }

    setLoading(false);
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-gold-500">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-navy-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-navy-700 px-6 py-4 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← Dashboard
        </Link>
        <div className="w-px h-4 bg-navy-700" />
        <span className="text-white font-medium">AI Tutor — {child.name}</span>
        <span className="text-gray-500 text-sm ml-auto">Self-Degree Framework</span>
      </header>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-3xl mx-auto w-full">
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gold-500 text-navy-900 rounded-br-md"
                    : "bg-navy-800 text-gray-200 rounded-bl-md border border-navy-700"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-navy-800 text-gray-400 rounded-2xl rounded-bl-md px-5 py-3 text-sm border border-navy-700">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-navy-700 px-6 py-4">
        <form
          onSubmit={handleSend}
          className="max-w-3xl mx-auto flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything, tell me what you're working on..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-navy-800 border border-navy-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gold-500 text-navy-900 font-semibold rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </form>
        <p className="text-center text-gray-600 text-xs mt-3 max-w-3xl mx-auto">
          AI responses are generated by Gemini · No session data is stored long-term
        </p>
      </div>
    </main>
  );
}
