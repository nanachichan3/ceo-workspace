"use client";

import { useEffect, useState, use } from "react";
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

type ProgressType = "READING" | "PROJECT" | "CONVERSATION" | "EXPLORATION" | "PRACTICE" | "OTHER";
type ProjectStatus = "IDEATION" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

interface ProgressEntry {
  id: string;
  date: string;
  type: ProgressType;
  subject: string | null;
  description: string;
  xpEarned: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
}

interface Child {
  id: string;
  name: string;
  age: number;
  avatarUrl: string | null;
  xp: number;
  level: number;
  progressEntries: ProgressEntry[];
  projects: Project[];
}

const PROGRESS_TYPE_LABELS: Record<ProgressType, string> = {
  READING: "📖 Reading",
  PROJECT: "🚀 Project",
  CONVERSATION: "💬 Conversation",
  EXPLORATION: "🔍 Exploration",
  PRACTICE: "🎯 Practice",
  OTHER: "✨ Other",
};

const PROJECT_STATUS_BADGES: Record<ProjectStatus, { label: string; color: string }> = {
  IDEATION: { label: "Ideation", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  IN_PROGRESS: { label: "In Progress", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  COMPLETED: { label: "Completed", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  ABANDONED: { label: "Abandoned", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

export default function ChildProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<ProgressType>("OTHER");
  const [formSubject, setFormSubject] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formXp, setFormXp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
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
        } else if (res.status === 404) {
          router.push("/dashboard");
        }
        setLoading(false);
      });
  }, [id, router]);

  async function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!formDescription.trim()) {
      setFormError("Description is required.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const {
        data: { session },
      } = await getSupabase().auth.getSession();
      if (!session) return;

      const res = await fetch(`/api/children/${id}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          type: formType,
          subject: formSubject.trim() || null,
          description: formDescription.trim(),
          xpEarned: formXp ? parseInt(formXp) : 0,
        }),
      });

      if (res.ok) {
        // Reload child data
        const childRes = await fetch(`/api/children/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (childRes.ok) {
          const data = await childRes.json();
          setChild(data.child);
        }
        setShowAddForm(false);
        setFormSubject("");
        setFormDescription("");
        setFormXp("");
        setFormType("OTHER");
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to add entry.");
      }
    } catch {
      setFormError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-gold-500">Loading...</div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-gray-400">Child not found.</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-navy-900">
      <header className="border-b border-navy-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-gold-500 font-bold text-lg">
            Self-Degree
          </Link>
          <Link
            href={`/children/${id}/ai-tutor`}
            className="px-4 py-2 bg-gold-500/20 text-gold-500 text-sm font-semibold rounded-lg hover:bg-gold-500/30 transition-colors"
          >
            🤖 AI Tutor
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Child Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center text-3xl">
            {child.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={child.avatarUrl} alt={child.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              "🎓"
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{child.name}</h1>
            <p className="text-gray-400">Age {child.age}</p>
            <div className="flex gap-4 mt-1.5">
              <span className="text-sm text-gold-500">⭐ {child.xp} XP</span>
              <span className="text-sm text-gray-500">Level {child.level}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Timeline */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-white">Progress</h2>
              <button
                onClick={() => setShowAddForm((v) => !v)}
                className="px-4 py-2 bg-gold-500 text-navy-900 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors"
              >
                {showAddForm ? "Cancel" : "+ Add Entry"}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddEntry} className="mb-8 p-5 bg-navy-800 border border-navy-700 rounded-xl space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ProgressType)}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                  >
                    {Object.entries(PROGRESS_TYPE_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subject <span className="text-gray-500 text-xs">(optional)</span></label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="e.g. Ancient Egypt"
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">What happened?</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe what they learned or did..."
                    rows={3}
                    required
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-gray-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">XP Earned</label>
                  <input
                    type="number"
                    value={formXp}
                    onChange={(e) => setFormXp(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-gray-500"
                  />
                </div>
                {formError && <p className="text-red-400 text-sm">{formError}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-gold-500 text-navy-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Entry"}
                </button>
              </form>
            )}

            {child.progressEntries.length === 0 ? (
              <div className="bg-navy-800 border border-navy-700 rounded-xl p-8 text-center">
                <p className="text-gray-400">No progress entries yet. Add one above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {child.progressEntries.map((entry) => (
                  <div key={entry.id} className="bg-navy-800 border border-navy-700 rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gold-500/20 text-gold-500 rounded-full mb-2">
                          {PROGRESS_TYPE_LABELS[entry.type]}
                        </span>
                        {entry.subject && (
                          <p className="text-gold-400 text-sm font-medium mb-1">{entry.subject}</p>
                        )}
                        <p className="text-gray-200 text-sm leading-relaxed">{entry.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        {entry.xpEarned > 0 && (
                          <span className="text-gold-500 text-sm font-medium">+{entry.xpEarned} XP</span>
                        )}
                        <p className="text-gray-500 text-xs mt-1">{formatDate(entry.date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Projects */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-5">Projects</h2>
            {child.projects.length === 0 ? (
              <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 text-center">
                <p className="text-gray-400 text-sm">No projects yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {child.projects.map((project) => {
                  const badge = PROJECT_STATUS_BADGES[project.status];
                  return (
                    <div key={project.id} className="bg-navy-800 border border-navy-700 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-white font-medium text-sm">{project.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed">{project.description}</p>
                      <p className="text-gray-600 text-xs mt-2">{formatDate(project.createdAt)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
