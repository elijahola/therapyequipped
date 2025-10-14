import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const { itemCount } = useCart();
  const prevCountRef = useRef(itemCount);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Animate cart badge when item count changes
  useEffect(() => {
    if (itemCount > prevCountRef.current) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = itemCount;
  }, [itemCount]);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-brand-black text-white text-center py-2 text-sm">
        <p>Free Shipping on Orders Over $30 | Lifetime Guarantee on All Products</p>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="font-bold text-xl text-brand-black hover:text-gray-700 transition-colors"
              onClick={closeMobileMenu}
            >
              THERAPY EQUIPPED
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/shop"
                className="text-gray-700 hover:text-brand-black transition-colors font-medium"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-brand-black transition-colors font-medium"
              >
                Why Get Equipped
              </Link>
              <Link
                to="/testimonials"
                className="text-gray-700 hover:text-brand-black transition-colors font-medium"
              >
                Testimonials
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              <Link
                to="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <ShoppingCart className={`w-6 h-6 text-gray-700 ${cartBounce ? 'animate-bounce' : ''}`} />
                {itemCount > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-brand-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold transition-transform ${cartBounce ? 'scale-125' : 'scale-100'}`}>
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 shadow-lg">
            <div className="container-custom space-y-4">
              <Link
                to="/shop"
                className="block py-2 text-lg text-gray-700 hover:text-brand-black transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="block py-2 text-lg text-gray-700 hover:text-brand-black transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Why Get Equipped
              </Link>
              <Link
                to="/testimonials"
                className="block py-2 text-lg text-gray-700 hover:text-brand-black transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Testimonials
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
