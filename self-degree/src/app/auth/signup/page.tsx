"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your email to complete signup and join the waitlist!",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to send magic link. Please try again." });
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-navy-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-gold-500 font-bold text-xl">
            Self-Degree
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6">Join the Waitlist</h1>
          <p className="text-gray-400 mt-2">
            Enter your email to reserve your spot. We open enrollment in 2026.
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="bg-navy-800 border border-navy-700 rounded-xl p-8 space-y-6"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-navy-900 border border-navy-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-900/30 text-green-400 border border-green-800"
                  : "bg-red-900/30 text-red-400 border border-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold-500 text-navy-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Join the Waitlist →"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-gold-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
