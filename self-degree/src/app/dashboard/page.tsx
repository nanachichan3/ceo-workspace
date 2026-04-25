"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}
import type { User } from "@supabase/supabase-js";

interface Child {
  id: string;
  name: string;
  age: number;
  avatarUrl?: string;
  _count?: { progressEntries: number; projects: number };
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await getSupabase().auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      setUser(session.user);

      // Load children from our API
      try {
        const res = await fetch("/api/children", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setChildren(data.children ?? []);
        }
      } catch {
        // API not ready yet
      }

      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await getSupabase().auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-gold-500">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-navy-900">
      {/* Header */}
      <header className="border-b border-navy-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-gold-500 font-bold text-lg">
            Self-Degree
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Family Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.user_metadata?.name || "Parent"}</p>
          </div>
          <Link
            href="/children/new"
            className="px-5 py-2.5 bg-gold-500 text-navy-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
          >
            + Add Child
          </Link>
        </div>

        {/* Children */}
        {children.length === 0 ? (
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No children added yet
            </h2>
            <p className="text-gray-400 mb-6">
              Add your first child to start tracking their learning journey.
            </p>
            <Link
              href="/children/new"
              className="inline-block px-6 py-3 bg-gold-500 text-navy-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
            >
              Add Your First Child
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/children/${child.id}`}
                className="bg-navy-800 border border-navy-700 rounded-xl p-6 hover:border-gold-500 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gold-500/20 rounded-full flex items-center justify-center text-2xl">
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
                    <h3 className="text-lg font-semibold text-white group-hover:text-gold-500 transition-colors">
                      {child.name}
                    </h3>
                    <p className="text-gray-400 text-sm">Age {child.age}</p>
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span>📝 {child._count?.progressEntries ?? 0} entries</span>
                      <span>🚀 {child._count?.projects ?? 0} projects</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/children/${child.id}`}
                    className="flex-1 text-center py-2 bg-navy-700 text-gray-300 text-sm rounded-lg hover:bg-navy-600 transition-colors"
                  >
                    Progress
                  </Link>
                  <Link
                    href={`/children/${child.id}/ai-tutor`}
                    className="flex-1 text-center py-2 bg-gold-500/20 text-gold-500 text-sm rounded-lg hover:bg-gold-500/30 transition-colors"
                  >
                    AI Tutor
                  </Link>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
