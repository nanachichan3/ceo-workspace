"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What ages is Self-Degree designed for?",
    answer:
      "Self-Degree is built for families with children ages 8–18. The framework scales from early exploration through high school and beyond.",
  },
  {
    question: "What about college? Are you anti-college?",
    answer:
      "No. Some Self-Degree kids will go to college — with purpose, not just because it's 'what you do.' Others will build careers or businesses without a degree. Self-Degree prepares for the real world, not for a single prescribed path.",
  },
  {
    question: "How does it handle social development?",
    answer:
      "This is the question we hear most. Social development happens through co-ops, community programs, sports, mentorship, and intentional social exposure. We provide frameworks and community for this — it doesn't happen automatically, but it's manageable.",
  },
  {
    question: "What does a typical day look like?",
    answer:
      "Most Self-Degree families report 3–5 hours of structured learning per day. The rest is self-directed exploration, community activities, or free time. No bells. No 7-period days. The structure follows the kid — not the other way around.",
  },
  {
    question: "How much does Self-Degree cost?",
    answer:
      "Enrollment details are shared when we open spots. The framework principles are documented publicly — families can implement the core approach without paying anything. What you're paying for is the AI tools, the community, the structure, and the hands-on support.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-stone-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-semibold text-stone-900 text-base md:text-lg">{question}</span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center transition-transform ${open ? "rotate-45" : ""}`}
        >
          <svg className="w-3 h-3 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-stone-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section className="w-full bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-12">
          <p className="text-amber font-semibold uppercase tracking-widest text-sm mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
            Questions families ask.
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm px-6 md:px-8">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber text-white font-semibold text-lg hover:bg-amber/90 transition-colors shadow-sm"
          >
            Join the Waitlist
          </a>
        </div>
      </div>
    </section>
  );
}
