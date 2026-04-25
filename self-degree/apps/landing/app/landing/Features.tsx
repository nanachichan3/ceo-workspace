const features = [
  {
    title: "Learning that follows curiosity",
    description:
      "When kids are interested, learning accelerates. Self-Degree builds curriculum around interests, not despite them.",
  },
  {
    title: "An AI tutor that never burns out",
    description:
      "Our AI adapts to your child's pace, answers questions at 2am, and can dive as deep as the questions go. Unlimited patience, unlimited depth.",
  },
  {
    title: "Skills that can be demonstrated",
    description:
      "Portfolios over transcripts. Projects over test scores. Your child builds real things they can show, explain, and be proud of.",
  },
  {
    title: "A framework, not a script",
    description:
      "Self-Degree gives you the structure and tools — not a rigid script. The framework adapts to your family, your values, your child's needs.",
  },
  {
    title: "Community and accountability",
    description:
      "You're not doing this alone. Self-Degree families connect, share, and support each other through the journey.",
  },
  {
    title: "Preparation for the real world",
    description:
      "Not just academic knowledge — critical thinking, self-direction, problem-solving, and the ability to learn anything independently.",
  },
];

export function Features() {
  return (
    <section className="w-full bg-stone-100">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-16">
          <p className="text-amber font-semibold uppercase tracking-widest text-sm mb-4">What You Get</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
            Everything a self-directed learner needs.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-stone-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-stone-500 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
