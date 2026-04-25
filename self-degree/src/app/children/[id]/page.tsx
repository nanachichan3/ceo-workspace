"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}

interface ProgressEntry {
  id: string;
  type: string;
  subject?: string;
  description: string;
  xpEarned: number;
  date: string;
}

interface Child {
  id: string;
  name: string;
  age: number;
  avatarUrl?: string;
  progressEntries: ProgressEntry[];
  _count?: { projects: number };
}

const TYPE_ICONS: Record<string, string> = {
  READING: "📖",
  PROJECT: "🚀",
  CONVERSATION: "💬",
  EXPLORATION: "🔭",
  PRACTICE: "🎯",
  OTHER: "✨",
};

export default function ChildPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ access_token: string } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [logType, setLogType] = useState<keyof typeof TYPE_ICONS>("PROJECT");
  const [logSubject, setLogSubject] = useState("");
  const [logDesc, setLogDesc] = useState("");
  const [logging, setLogging] = useState(false);

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

      const res = await fetch(`/api/children/${id}`, {
        headers: { Authorization: `Bearer ${authSession.access_token}` },
      });

      if (!res.ok) {
        router.push("/dashboard");
        return;
      }

      const data = await res.json();
      setChild(data.child);
      setLoading(false);
    }
    load();
  }, [id, router]);

  async function handleLog(e: React.FormEvent) {
    e.preventDefault();
    if (!logDesc.trim() || !session) return;

    setLogging(true);
    const res = await fetch(`/api/children/${id}/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        type: logType,
        subject: logSubject || null,
        description: logDesc,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setChild((prev) =>
        prev
          ? { ...prev, progressEntries: [data.entry, ...prev.progressEntries] }
          : prev
      );
      setShowForm(false);
      setLogDesc("");
      setLogSubject("");
    }
    setLogging(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-gold-500">Loading...</div>
      </div>
    );
  }

  if (!child) return null;

  const totalXp = child.progressEntries.reduce((sum, e) => sum + e.xpEarned, 0);

  return (
    <main className="min-h-screen bg-navy-900">
      <header className="border-b border-navy-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">
            ← Dashboard
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-white font-medium">{child.name}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Child Card */}
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center text-4xl shrink-0">
              {child.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={child.avatarUrl}
                  alt={child.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                "🎓"
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{child.name}</h1>
              <p className="text-gray-400">Age {child.age}</p>
              <div className="flex gap-6 mt-4">
                <div>
                  <div className="text-2xl font-bold text-gold-500">{totalXp}</div>
                  <div className="text-gray-500 text-sm">Total XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {child.progressEntries.length}
                  </div>
                  <div className="text-gray-500 text-sm">Entries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {child._count?.projects ?? 0}
                  </div>
                  <div className="text-gray-500 text-sm">Projects</div>
                </div>
              </div>
            </div>
            <Link
              href={`/children/${child.id}/ai-tutor`}
              className="px-5 py-2.5 bg-gold-500 text-navy-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors shrink-0"
            >
              🤖 AI Tutor
            </Link>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Learning Timeline</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-sm bg-navy-800 border border-navy-600 text-gray-300 rounded-lg hover:border-gold-500 transition-colors"
          >
            {showForm ? "Cancel" : "+ Log Progress"}
          </button>
        </div>

        {/* Log Form */}
        {showForm && (
          <form
            onSubmit={handleLog}
            className="bg-navy-800 border border-navy-700 rounded-xl p-6 mb-6 space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={logType}
                  onChange={(e) =>
                    setLogType(e.target.value as keyof typeof TYPE_ICONS)
                  }
                  className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white"
                >
                  {Object.entries(TYPE_ICONS).map(([key, icon]) => (
                    <option key={key} value={key}>
                      {icon} {key}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Subject (optional)
                </label>
                <input
                  value={logSubject}
                  onChange={(e) => setLogSubject(e.target.value)}
                  placeholder="Math, Drawing, Minecraft..."
                  className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white placeholder-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={logDesc}
                onChange={(e) => setLogDesc(e.target.value)}
                placeholder="What happened? What did they learn or discover?"
                rows={4}
                required
                className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white placeholder-gray-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={logging}
                className="px-5 py-2 bg-gold-500 text-navy-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50"
              >
                {logging ? "Saving..." : "Save Entry (+10 XP)"}
              </button>
            </div>
          </form>
        )}

        {/* Timeline */}
        {child.progressEntries.length === 0 ? (
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No entries yet
            </h3>
            <p className="text-gray-400">
              Start logging learning moments to build the portfolio.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {child.progressEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-navy-800 border border-navy-700 rounded-xl p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-navy-700 rounded-lg flex items-center justify-center text-xl shrink-0">
                    {TYPE_ICONS[entry.type] ?? "✨"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-medium text-sm">
                        {entry.type}
                      </span>
                      {entry.subject && (
                        <span className="text-gold-500/80 text-xs bg-gold-500/10 px-2 py-0.5 rounded">
                          {entry.subject}
                        </span>
                      )}
                      <span className="text-gray-600 text-xs ml-auto">
                        +{entry.xpEarned} XP
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {entry.description}
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
