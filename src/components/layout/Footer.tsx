import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">THERAPY EQUIPPED</h3>
            <p className="text-sm">
              Professional recovery tools for athletes and everyday wellness. Quality products backed by our lifetime guarantee.
            </p>
          </div>

          {/* Shop Section */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/product/tegun-pro" className="hover:text-white transition-colors">
                  TEgun Pro
                </Link>
              </li>
              <li>
                <Link to="/product/tegun-lite" className="hover:text-white transition-colors">
                  TEgun Lite
                </Link>
              </li>
              <li>
                <Link to="/product/teroller" className="hover:text-white transition-colors">
                  TEroller
                </Link>
              </li>
              <li>
                <Link to="/product/teboard" className="hover:text-white transition-colors">
                  TEboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <a href="mailto:therapyequipped@gmail.com" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantees Section */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Our Promise</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>Lifetime Guarantee</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>30-Day Money Back</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>Free Shipping Over $30</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>Secure Checkout</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>
            &copy; {currentYear} Therapy Equipped. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="mailto:therapyequipped@gmail.com" className="hover:text-white transition-colors">
              Contact Support
            </a>
            <Link to="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
