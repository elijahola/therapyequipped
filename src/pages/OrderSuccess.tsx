import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { sendCustomerReceipt } from '../services/emailService';
import { track } from '../lib/analytics';

export const OrderSuccess = () => {
  const { clearCart } = useCart();
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Get checkout info from sessionStorage
    const checkoutInfoStr = sessionStorage.getItem('checkoutInfo');

    if (checkoutInfoStr && !emailSent) {
      const checkoutInfo = JSON.parse(checkoutInfoStr);

      // Funnel end: confirmed purchase. Guarded by the same sessionStorage
      // gate as the receipt email, so a refresh never double-counts revenue.
      track('purchase_completed', {
        items: checkoutInfo.items?.length,
        subtotal: checkoutInfo.subtotal,
        shipping: checkoutInfo.shipping,
        total: checkoutInfo.total,
      });

      // Send customer receipt email
      sendCustomerReceipt({
        items: checkoutInfo.items,
        subtotal: checkoutInfo.subtotal,
        shipping: checkoutInfo.shipping,
        total: checkoutInfo.total,
        customerInfo: checkoutInfo.customerInfo,
      }).then((success) => {
        if (success) {
          console.log('✅ Customer receipt sent');
          setEmailSent(true);
        }
      });

      // Clear cart
      clearCart();

      // Clean up sessionStorage
      sessionStorage.removeItem('checkoutInfo');
    }
  }, [clearCart, emailSent]);

  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="bg-success/10 rounded-full p-6">
            <CheckCircle className="w-20 h-20 text-success" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your purchase. We've received your order and will send you a confirmation email shortly.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8 text-left">
          <h2 className="text-xl font-bold mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-success text-xl">✓</span>
              <div>
                <h3 className="font-semibold">Order Confirmation</h3>
                <p className="text-sm text-gray-600">
                  Check your email for order details and tracking information
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-success text-xl">✓</span>
              <div>
                <h3 className="font-semibold">Processing</h3>
                <p className="text-sm text-gray-600">
                  Your order will be processed within 1-2 business days
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-success text-xl">✓</span>
              <div>
                <h3 className="font-semibold">Delivery</h3>
                <p className="text-sm text-gray-600">
                  You'll receive tracking information once your order ships
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantees Reminder */}
        <div className="bg-brand-black text-white rounded-lg p-6 mb-8">
          <h3 className="font-bold text-lg mb-3">Your Purchase is Protected</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Lifetime Guarantee</p>
              <p className="text-gray-300">We stand behind our products forever</p>
            </div>
            <div>
              <p className="font-semibold">30-Day Money Back</p>
              <p className="text-gray-300">Not satisfied? Get a full refund</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              Back to Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="secondary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Support */}
        <p className="mt-8 text-gray-600">
          Need help? Contact us at{' '}
          <a href="mailto:therapyequipped@gmail.com" className="text-brand-black font-semibold hover:underline">
            therapyequipped@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};
