export const About = () => {
  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-12">Why Get EQUIPPED?</h1>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        {/* Left Column - Text Content */}
        <div>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            At Therapy Equipped, we believe everyone deserves access to professional-grade recovery tools.
            Our mission is to make high-quality massage guns, rollers, and exercise equipment affordable
            and accessible.
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Every product comes with our lifetime guarantee because we stand behind the quality of what we sell.
            We're not just selling tools—we're helping you invest in your long-term wellness and recovery.
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Whether you're an athlete, fitness enthusiast, or someone dealing with everyday aches and pains,
            THERAPY EQUIPPED has the tools you need to feel your best.
          </p>

          {/* Key Values */}
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-success text-2xl">✓</span>
              <div>
                <h3 className="font-bold text-lg mb-1">Lifetime Guarantee</h3>
                <p className="text-gray-600">We stand behind our products forever</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-success text-2xl">✓</span>
              <div>
                <h3 className="font-bold text-lg mb-1">Quality First</h3>
                <p className="text-gray-600">Professional-grade tools at affordable prices</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-success text-2xl">✓</span>
              <div>
                <h3 className="font-bold text-lg mb-1">Customer Focused</h3>
                <p className="text-gray-600">30-day money back guarantee on all products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Photo Card */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-[4/5] relative bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              {/* Placeholder for photo - update this src with your actual image */}
              <img
                src="/images/about/team-photo.png"
                alt="THERAPY EQUIPPED Team"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback styling if image doesn't exist yet
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-center px-8">
                        <svg class="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="text-gray-500 font-medium">Add Your Photo Here</p>
                        <p class="text-sm text-gray-400 mt-2">Replace /images/about/team-photo.jpg</p>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            <div className="p-6 bg-white">
              <h3 className="font-bold text-xl mb-2">Built for Recovery</h3>
              <p className="text-gray-600">
                Our products are designed with one goal: helping you recover faster and feel better every day.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Mission Statement */}
      <div className="bg-gray-50 rounded-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Commitment to You</h2>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
          We're committed to providing the best recovery tools on the market, backed by unbeatable warranties
          and customer service. When you choose THERAPY EQUIPPED, you're choosing quality, reliability, and peace of mind.
        </p>
      </div>
    </div>
  );
};
