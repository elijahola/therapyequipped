import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <div className="bg-gray-100 rounded-full p-6">
            <AlertCircle className="w-20 h-20 text-gray-400" />
          </div>
        </div>

        {/* 404 Message */}
        <h1 className="text-6xl font-bold mb-4 text-gray-900">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        {/* Suggestions */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8 text-left">
          <h3 className="font-bold text-lg mb-4">Here are some helpful links:</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="text-brand-black hover:underline flex items-center gap-2">
                → Go to Homepage
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-brand-black hover:underline flex items-center gap-2">
                → Browse All Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-brand-black hover:underline flex items-center gap-2">
                → View Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-brand-black hover:underline flex items-center gap-2">
                → Learn About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <Link to="/shop">
          <Button variant="primary" size="lg">
            Shop All Products
          </Button>
        </Link>
      </div>
    </div>
  );
};
