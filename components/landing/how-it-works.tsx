const steps = [
  {
    step: "01",
    title: "Connect",
    description: "Sign up and configure your alert preferences in 2 minutes.",
  },
  {
    step: "02",
    title: "Scan",
    description: "AI monitors markets 24/7 for profitable opportunities.",
  },
  {
    step: "03",
    title: "Profit",
    description:
      "Receive instant alerts with clear entry points and expected returns.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-slate-900/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Simple by design
          </h2>
          <p className="text-lg text-slate-400">
            Get started in minutes, not hours.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="text-4xl font-bold text-emerald-500/20 mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
