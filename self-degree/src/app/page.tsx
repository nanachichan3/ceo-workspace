"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 bg-navy-900">
        <p className="text-gold-500 text-sm font-medium tracking-widest uppercase mb-6">
          AI-Powered · Self-Directed · Family-First
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 max-w-4xl leading-tight">
          Education for the World{" "}
          <span className="text-gold-500">as It Actually Exists</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mb-10">
          Self-Degree is a self-directed, AI-powered education framework for
          families who have stopped asking &quot;is school working?&quot; and started
          asking &quot;what are we actually preparing our kids for?&quot;
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-gold-500 text-navy-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
          >
            Join the Waitlist
          </Link>
          <Link
            href="#how-it-works"
            className="px-8 py-4 border border-gray-600 text-white font-medium rounded-lg hover:border-gold-500 transition-colors"
          >
            See How It Works
          </Link>
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 py-24 bg-navy-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-16 text-center">
            The education system was not built for the world your kids actually
            live in.
          </h2>
          <div className="space-y-8">
            {[
              {
                title: "It is built for 1890.",
                quote:
                  "&quot;I wish someone had told me that the factory-model school system was designed to produce obedient workers — not independent thinkers.&quot;",
              },
              {
                title: "It treats all kids the same.",
                quote:
                  "&quot;My daughter learns in 45 minutes what takes her class 3 weeks. But she has to wait for everyone else.&quot;",
              },
              {
                title: "It is burning kids out before high school.",
                quote:
                  "&quot;A 12-year-old should not need a therapist just to survive 8th grade.&quot;",
              },
            ].map((item, i) => (
              <div key={i} className="border-l-4 border-gold-500 pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p
                  className="text-gray-400 italic"
                  dangerouslySetInnerHTML={{ __html: item.quote }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="how-it-works" className="px-6 py-24 bg-navy-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Self-Degree: A framework that follows the kid.
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Not a curriculum. Not a school. A complete education framework built
            around your child&apos;s interests, pace, and potential — powered by AI
            tutors that actually adapt.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                pillar: "Self-Directed",
                desc: "Kids learn fastest when they are learning what they care about. Self-Degree starts with your child&apos;s interests and builds from there.",
              },
              {
                pillar: "AI-Powered",
                desc: "A personalized AI tutor that is patient, adapts to your child&apos;s learning style, and can go as deep as they want. No more waiting.",
              },
              {
                pillar: "Portfolio-Based",
                desc: "Real projects. Real skills. A body of work that speaks for itself — whether to a college, an employer, or your child.",
              },
            ].map((item) => (
              <div
                key={item.pillar}
                className="bg-navy-800 border border-navy-700 rounded-xl p-8"
              >
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-gold-500 text-2xl">✦</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.pillar}
                </h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-gold-500">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">
            Ready to build a different path?
          </h2>
          <p className="text-navy-800 mb-8">
            Join the waitlist. We open enrollment in 2026.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-navy-900 text-white font-semibold rounded-lg hover:bg-navy-800 transition-colors"
          >
            Join the Self-Degree Waitlist →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-navy-900 border-t border-navy-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Self-Degree. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/auth/login" className="hover:text-gold-500">
              Sign In
            </Link>
            <Link href="/auth/signup" className="hover:text-gold-500">
              Join Waitlist
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
