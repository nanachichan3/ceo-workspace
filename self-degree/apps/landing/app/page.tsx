import {
  Hero,
  Problem,
  Solution,
  HowItWorks,
  Features,
  Testimonials,
  FAQ,
  CTA,
  Footer,
} from "./landing";

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
