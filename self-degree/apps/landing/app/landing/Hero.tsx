export function Hero() {
  return (
    <section className="w-full bg-cream">
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber/10 text-amber text-sm font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber"></span>
            Self-Directed Education Framework
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center text-stone-900 leading-tight tracking-tight mb-6">
          Education for the World<br className="hidden md:block" />{" "}
          <span className="text-amber">as It Actually Exists</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-stone-500 text-center max-w-3xl mx-auto leading-relaxed mb-10">
          Self-Degree is a self-directed, AI-powered education framework for families who've stopped asking{" "}
          <em className="italic text-stone-700">"is school working?"</em> and started asking{" "}
          <em className="italic text-stone-700">"what are we actually preparing our kids for?"</em>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber text-white font-semibold text-lg hover:bg-amber/90 transition-colors shadow-sm"
          >
            Join the Waitlist
          </a>
          <a
            href="#discovery"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-stone-700 font-semibold text-lg border border-stone-300 hover:border-stone-400 hover:bg-stone-100 transition-colors"
          >
            Book a discovery call
          </a>
        </div>

        {/* Subtle divider */}
        <div className="mt-20 flex justify-center">
          <div className="w-16 h-px bg-stone-300"></div>
        </div>
      </div>
    </section>
  );
}
