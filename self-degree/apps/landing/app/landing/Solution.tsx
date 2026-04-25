export function Solution() {
  const pillars = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      title: "Self-Directed",
      description:
        "Kids learn fastest when they're learning what they care about. Self-Degree starts with your child's interests and builds from there — not the other way around.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "AI-Powered",
      description:
        "A personalized AI tutor that's patient, adapts to your child's learning style, and can go as deep as they want. No more waiting. No more frustration. No more 'I don't get it.'",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: "Portfolio-Based",
      description:
        "Real projects. Real skills. A body of work that speaks for itself — whether that's to a college admissions officer, a future employer, or your child themselves.",
    },
  ];

  return (
    <section className="w-full bg-cream">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-16">
          <p className="text-amber font-semibold uppercase tracking-widest text-sm mb-4">The Solution</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
            Self-Degree: A framework<br className="hidden md:block" /> that follows the kid.
          </h2>
          <p className="mt-4 text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Self-Degree is not a curriculum. It's not a school. It's a complete education framework built around your child's interests, pace, and potential — powered by AI tutors that actually adapt.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col items-start">
              <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center text-amber mb-4">
                {pillar.icon}
              </div>
              <h3 className="font-bold text-stone-900 text-xl mb-2">{pillar.title}</h3>
              <p className="text-stone-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
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
