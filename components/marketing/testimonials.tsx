import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "The arbitrage scanner found opportunities I would have missed. It's like having a dedicated analyst working around the clock.",
    author: "James M.",
    role: "Sports Bettor",
    rating: 5,
    avatar: "JM",
  },
  {
    quote:
      "Finally, one dashboard for all my trading signals. The AI briefings save me hours of research every morning.",
    author: "Sarah K.",
    role: "Day Trader",
    rating: 5,
    avatar: "SK",
  },
  {
    quote:
      "The crypto funding rate alerts have been incredibly accurate. Simple to set up and the WhatsApp alerts are instant.",
    author: "Alex T.",
    role: "Crypto Trader",
    rating: 5,
    avatar: "AT",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Trusted by Traders
          </h2>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            See what our users are saying about their experience with
            TradeSmart.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-3xl border border-gray-100 bg-white p-8 lg:p-10 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute top-8 right-8 lg:top-10 lg:right-10">
                <Quote className="h-8 w-8 text-emerald-100" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg text-gray-700 leading-relaxed mb-8">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-16 text-center text-sm text-gray-400 max-w-2xl mx-auto">
          Illustrative examples representing typical user experiences.
          Individual results may vary based on market conditions and trading
          strategy.
        </p>
      </div>
    </section>
  );
}
