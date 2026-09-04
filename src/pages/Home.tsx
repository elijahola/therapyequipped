import { Link } from 'react-router-dom';
import { SocialProof } from '../components/home/SocialProof';
import { useState, useEffect } from 'react';
import { Flame, Zap, Dumbbell, Target } from 'lucide-react';
import { Button } from '../components/common/Button';
import { products } from '../data/products';

export const Home = () => {
  const heroImages = [
    '/images/hero/hero0.jpg',
    '/images/hero/hero1.jpg',
    '/images/hero/hero2.jpg',
    '/images/hero/hero3.jpg',
    '/images/hero/hero4.jpg',
  ];

  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero Section with Carousel */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentHeroImage === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative h-full container-custom flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              THERAPY EQUIPPED
            </h1>
            <p className="text-xl md:text-3xl mb-8 text-gray-100">
              Professional recovery tools for athletes and everyday wellness. Get equipped for better recovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button variant="secondary" size="lg" fullWidth>
                  Shop Now
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="primary" size="lg" fullWidth>
                  Why Get Equipped
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentHeroImage === index
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Social proof: the brand's own footage */}
      <SocialProof />

      {/* Why Get EQUIPPED Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Get EQUIPPED?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Flame,
                title: 'Warmup Muscles',
                description: 'Prepare your muscles and joints for peak performance',
              },
              {
                icon: Zap,
                title: 'Recover Faster',
                description: 'Speed up recovery time after intense exercise',
              },
              {
                icon: Dumbbell,
                title: 'Relieve Pain',
                description: 'Reduce daily aches, soreness, and chronic pain',
              },
              {
                icon: Target,
                title: 'Improve Mobility',
                description: 'Enhance range of motion, blood flow, and flexibility',
              },
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-brand-black rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complete Recovery System Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Complete Recovery System
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                From powerful massage guns to essential recovery rollers and strength training equipment,
                THERAPY EQUIPPED provides everything you need for a complete recovery and fitness routine.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Each product is designed to work together, helping you warm up before exercise,
                recover after workouts, and maintain your wellness every day.
              </p>
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  Shop Complete System
                </Button>
              </Link>
            </div>

            {/* Right: Product Line Image */}
            <div className="order-1 lg:order-2">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="/images/lifestyle/all-products.png"
                  alt="Complete THERAPY EQUIPPED Product Line"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Our Products
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Professional-grade recovery tools backed by our lifetime guarantee
          </p>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow text-center group overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.images.main}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-gray-700">{product.name}</h3>
                  <p className="text-2xl font-bold mb-2">${product.price.toFixed(2)}</p>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  {product.shippingCost === 0 && (
                    <p className="text-success text-sm font-semibold mt-2">Free Shipping</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/shop">
              <Button variant="primary" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Guarantees Banner */}
      <section className="py-16 bg-brand-black text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Lifetime Guarantee</h3>
              <p className="text-gray-300">We stand behind our products forever</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">30-Day Money Back</h3>
              <p className="text-gray-300">Not satisfied? Get a full refund</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Free Shipping Over $30</h3>
              <p className="text-gray-300">Fast delivery on all orders</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
