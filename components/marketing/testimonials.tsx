import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "The arbitrage scanner found opportunities I would have missed. It's like having a dedicated analyst working 24/7.",
    author: "James M.",
    role: "Sports Bettor",
    rating: 5,
  },
  {
    quote:
      "Finally, one dashboard for all my trading signals. The AI briefings save me hours of research every morning.",
    author: "Sarah K.",
    role: "Day Trader",
    rating: 5,
  },
  {
    quote:
      "The crypto funding rate alerts have been incredibly accurate. Simple to set up and the WhatsApp alerts are instant.",
    author: "Alex T.",
    role: "Crypto Trader",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Trusted by Traders
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            See what our users are saying about TradeSmart.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-8"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          Illustrative examples representing typical user experiences.
          Individual results may vary.
        </p>
      </div>
    </section>
  );
}
