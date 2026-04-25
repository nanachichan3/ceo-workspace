export function Problem() {
  const painPoints = [
    {
      title: "It's built for 1890",
      quote:
        "I wish someone had told me that the factory-model school system was designed to produce obedient workers — not independent thinkers. My kid is being prepared for a world that no longer exists.",
      attribution: "Every parent who pulls their child out",
    },
    {
      title: "It treats all kids the same",
      quote:
        "I wish someone had told me that 'one-size-fits-all' education was a feature of industrial efficiency, not educational design. My daughter learns in 45 minutes what takes her class 3 weeks. But she has to wait for everyone else.",
      attribution: "Parent of a twice-gifted learner",
    },
    {
      title: "It's burning kids out before high school",
      quote:
        "I wish someone had told me that the anxiety, the sleep deprivation, the 'I hate school' tears at 7am weren't normal. That a 12-year-old shouldn't need a therapist just to survive 8th grade.",
      attribution: "Parent of a struggling middle schooler",
    },
  ];

  return (
    <section className="w-full bg-stone-100">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-16">
          <p className="text-amber font-semibold uppercase tracking-widest text-sm mb-4">The Problem</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
            The education system wasn't built for<br className="hidden md:block" /> the world your kids actually live in.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-amber flex-shrink-0 mt-1"></span>
                <h3 className="font-bold text-stone-900 text-lg">{point.title}</h3>
              </div>
              <blockquote className="text-stone-600 leading-relaxed text-base italic mb-4">
                "{point.quote}"
              </blockquote>
              <p className="text-stone-400 text-sm font-medium">— {point.attribution}</p>
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
