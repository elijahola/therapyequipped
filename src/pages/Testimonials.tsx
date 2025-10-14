import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  product: string;
  text: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Marcus Johnson',
    location: 'Atlanta, GA',
    rating: 5,
    product: 'TEgun Pro',
    text: 'Best massage gun I\'ve owned. The battery life is incredible and it hits all the right spots after my workouts. Worth every penny!',
    date: '2 weeks ago',
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    location: 'Los Angeles, CA',
    rating: 5,
    product: 'TEgun Lite',
    text: 'Love my Green Goblin TEgun Lite! Perfect for travel and works just as well as the bulkier options. The color is gorgeous too.',
    date: '1 month ago',
  },
  {
    id: 3,
    name: 'David Chen',
    location: 'Houston, TX',
    rating: 5,
    product: 'TEroller',
    text: 'Simple but effective. Use it every day for my IT band and calves. The price point is unbeatable for the quality.',
    date: '3 weeks ago',
  },
  {
    id: 4,
    name: 'Jennifer Williams',
    location: 'Chicago, IL',
    rating: 5,
    product: 'TEboard',
    text: 'Game changer for my home workouts! The different positions really target different muscle groups. Highly recommend.',
    date: '1 week ago',
  },
  {
    id: 5,
    name: 'Robert Taylor',
    location: 'Phoenix, AZ',
    rating: 5,
    product: 'TEgun Pro',
    text: 'The lifetime guarantee sold me on this. No regrets. This thing is built like a tank and feels premium.',
    date: '2 months ago',
  },
  {
    id: 6,
    name: 'Emily Rodriguez',
    location: 'Miami, FL',
    rating: 5,
    product: 'TEgun Lite',
    text: 'Got the Flash color and I\'m obsessed! Great for post-yoga recovery and it\'s so quiet I can use it while watching TV.',
    date: '3 weeks ago',
  },
];

export const Testimonials = () => {
  return (
    <div>
      {/* Hero Banner with Review Image */}
      <div className="relative h-[400px] overflow-hidden mb-16">
        <img
          src="/images/testimonials/review-hero.png"
          alt="Customer Review"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom pb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our Customers Say
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              Real reviews from real people who trust THERAPY EQUIPPED for their recovery needs.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom pb-12">

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < testimonial.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-700 mb-6 leading-relaxed">&quot;{testimonial.text}&quot;</p>

            {/* Product */}
            <p className="text-sm text-brand-black font-semibold mb-4">
              Product: {testimonial.product}
            </p>

            {/* Customer Info */}
            <div className="pt-4 border-t border-gray-200">
              <p className="font-semibold text-gray-900">{testimonial.name}</p>
              <p className="text-sm text-gray-600">{testimonial.location}</p>
              <p className="text-xs text-gray-500 mt-1">{testimonial.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center bg-gray-50 py-12 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Join Thousands of Satisfied Customers</h2>
        <p className="text-gray-600 mb-6">
          Experience the THERAPY EQUIPPED difference with our lifetime guarantee
        </p>
        <a
          href="/shop"
          className="inline-block bg-brand-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Shop Now
        </a>
      </div>
      </div>
    </div>
  );
};
