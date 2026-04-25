"use client";

import { useState } from "react";

export function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section id="waitlist" className="w-full bg-stone-900">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-24 text-center">
        <p className="text-amber font-semibold uppercase tracking-widest text-sm mb-4">
          Join the Waitlist
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
          The question you might already be asking.
        </h2>
        <p className="text-stone-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          If you're here, you've probably already asked it:{" "}
          <em className="italic text-stone-300">"Is this education actually preparing my kid for life?"</em>
        </p>
        <p className="text-stone-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Self-Degree is an answer to that question. It's not the only answer. But if you're ready for something different — and you want a framework that actually works — we'd love to show you what's possible.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-4 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-base"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-xl bg-amber text-white font-semibold text-base hover:bg-amber/90 transition-colors whitespace-nowrap"
            >
              Join the Waitlist
            </button>
          </form>
        ) : (
          <div className="max-w-md mx-auto bg-green-100 border border-green-700/20 rounded-xl px-6 py-6">
            <p className="text-green-400 font-semibold text-lg">
              You're on the list!
            </p>
            <p className="text-stone-400 text-sm mt-1">
              We'll be in touch when enrollment opens.
            </p>
          </div>
        )}

        <p className="mt-6 text-stone-500 text-sm">
          We open enrollment when the first cohort is ready. Waitlist members get early access and priority.
        </p>
      </div>
    </section>
  );
}
