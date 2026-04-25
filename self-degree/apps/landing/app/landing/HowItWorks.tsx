export function HowItWorks() {
  const phases = [
    {
      phase: "Phase 1",
      name: "Discovery",
      duration: "0–3 months",
      description:
        "Wide exposure. No pressure to 'produce.' Let your child explore subjects, activities, and ways of learning. The goal: surface genuine interests and natural learning styles.",
    },
    {
      phase: "Phase 2",
      name: "Depth",
      duration: "3–12 months",
      description:
        "Once interests emerge, Self-Degree shifts to depth. Your child picks a domain (or two) and goes deep — AI-tutored, project-based, real outcomes.",
    },
    {
      phase: "Phase 3",
      name: "Portfolio",
      duration: "ongoing",
      description:
        "Skills are documented. Projects are built. Results are visible. By the time your child is 'college age' (or whatever comes next), they have a body of work — not a transcript.",
    },
  ];

  return (
    <section className="w-full bg-stone-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-16">
          <p className="text-amber font-semibold uppercase tracking-widest text-sm mb-4">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            The three phases of Self-Degree.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {phases.map((phase, index) => (
            <div key={phase.name} className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-amber text-stone-900 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <div>
                  <p className="text-amber text-xs font-semibold uppercase tracking-wider">{phase.phase}</p>
                  <h3 className="font-bold text-xl text-white">{phase.name}</h3>
                </div>
              </div>
              <p className="text-stone-400 text-sm font-medium mb-3">{phase.duration}</p>
              <p className="text-stone-300 leading-relaxed">{phase.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-2xl md:text-3xl font-bold text-white">
            Same destination. A better path.
          </p>
        </div>
      </div>
    </section>
  );
}
