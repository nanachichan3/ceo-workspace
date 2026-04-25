export function Testimonials() {
  const testimonials = [
    {
      quote:
        "We pulled our kids from private school two years ago. The change in their engagement is dramatic. They're learning more in 4 hours a day than they were in 7.",
      attribution: "Parent, 2 kids (ages 11 and 14)",
    },
    {
      quote:
        "My son was failing algebra in 8th grade. We pulled him, let him explore game development + math through code. He's now teaching himself linear algebra because he needs it for a game engine he wants to build.",
      attribution: "Parent, 1 child (age 15)",
    },
    {
      quote:
        "I was skeptical. I thought 'self-directed' meant 'no structure.' It doesn't. It means the structure follows the kid, not the other way around.",
      attribution: "Parent, 3 kids (ages 8, 12, 16)",
    },
  ];

  return (
    <section className="w-full bg-cream">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-16">
          <p className="text-amber font-semibold uppercase tracking-widest text-sm mb-4">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
            From families who chose differently.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
              {/* Quote mark */}
              <div className="text-amber/30 text-5xl font-serif leading-none mb-4">&ldquo;</div>
              <blockquote className="text-stone-600 leading-relaxed text-base italic mb-6">
                {t.quote}
              </blockquote>
              <p className="text-stone-400 text-sm font-medium border-t border-stone-200 pt-4">
                — {t.attribution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
