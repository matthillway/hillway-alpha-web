import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'James M.',
    role: 'Sports Bettor',
    location: 'London, UK',
    avatar: 'JM',
    content:
      'The arbitrage scanner has been a game-changer. I was skeptical at first, but the profits are real and consistent. Made back my annual subscription in the first week.',
    rating: 5,
    profit: '+2,340',
    period: 'First month',
  },
  {
    name: 'Sarah K.',
    role: 'Crypto Trader',
    location: 'Manchester, UK',
    avatar: 'SK',
    content:
      'The funding rate alerts are incredibly timely. I have set up a simple strategy and now earn passive income while I sleep. The AI briefings save me hours of research.',
    rating: 5,
    profit: '+890',
    period: 'Per week avg',
  },
  {
    name: 'David P.',
    role: 'Retail Investor',
    location: 'Edinburgh, UK',
    avatar: 'DP',
    content:
      'Finally a tool that gives retail investors an edge. The stock momentum alerts have helped me catch several breakouts early. The fear & greed signals are spot on.',
    rating: 5,
    profit: '+15%',
    period: 'Portfolio growth',
  },
];

const stats = [
  { value: '10,000+', label: 'Opportunities Found' },
  { value: '2,500+', label: 'Active Users' },
  { value: '97%', label: 'Alert Accuracy' },
  { value: '4.9/5', label: 'User Rating' },
];

export function SocialProof() {
  return (
    <section className="py-24 bg-gray-950 relative">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Smart Traders
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of traders who use Hillway Alpha to find profitable opportunities every day.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gray-800" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Profit badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
                <span className="text-green-400 font-semibold">{testimonial.profit}</span>
                <span className="text-gray-400 text-sm ml-2">{testimonial.period}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.role} - {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-50">
          <div className="text-gray-500 text-sm">Trusted by traders from:</div>
          <div className="flex items-center gap-8 text-gray-500">
            <span className="font-semibold">UK</span>
            <span className="font-semibold">EU</span>
            <span className="font-semibold">USA</span>
            <span className="font-semibold">Australia</span>
          </div>
        </div>
      </div>
    </section>
  );
}
