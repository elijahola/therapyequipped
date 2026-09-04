import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { formatCurrency } from '../utils/formatting';
import { getProductById } from '../data/products';
import { sendOrderNotification } from '../services/emailService';
import { useToast } from '../context/ToastContext';
import { track } from '../lib/analytics';

export const Checkout = () => {
  const { items, subtotal, shipping, total } = useCart();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Funnel: reached checkout with something in the cart. Deliberately fires
  // once per visit to this page, not per keystroke.
  useEffect(() => {
    if (items.length > 0) {
      track('checkout_started', {
        items: items.length,
        subtotal,
        total,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    // Funnel: form validated and submitted — the moment of purchase intent.
    track('order_placed', {
      items: items.length,
      subtotal,
      shipping,
      total,
    });

    try {
      // Get API URL from environment
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      // Send order notification email to therapyequipped@gmail.com
      const emailSent = await sendOrderNotification({
        items,
        subtotal,
        shipping,
        total,
        customerInfo: formData,
      });

      if (!emailSent) {
        console.warn('Email notification failed, but continuing with order');
      }

      // Prepare items with product details for Stripe
      const stripeItems = items.map((item) => {
        const product = getProductById(item.productId);
        return {
          productId: item.productId,
          productName: product?.name || 'Unknown Product',
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          unitPrice: product?.price || 0,
          shippingCost: product?.shippingCost || 0,
        };
      });

      // Create Stripe Checkout Session
      console.log('💳 Creating Stripe Checkout Session...');
      const checkoutResponse = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: stripeItems,
          customerInfo: formData,
        }),
      });

      if (!checkoutResponse.ok) {
        const error = await checkoutResponse.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await checkoutResponse.json();

      // Store customer info in sessionStorage for success page
      sessionStorage.setItem('checkoutInfo', JSON.stringify({
        customerInfo: formData,
        items,
        subtotal,
        shipping,
        total,
      }));

      // Redirect to Stripe Checkout
      console.log('✅ Redirecting to Stripe Checkout...');
      window.location.href = url;
    } catch (error) {
      console.error('Order processing error:', error);
      showToast('Failed to process order. Please try again.', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <Input
                label="Email"
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
                placeholder="you@example.com"
              />
            </section>

            {/* Shipping Address */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    required
                  />
                </div>

                <Input
                  label="Address"
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={errors.address}
                  required
                  placeholder="123 Main St"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={errors.city}
                    required
                  />
                  <Input
                    label="State"
                    type="text"
                    name="state"
                    id="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={errors.state}
                    required
                    placeholder="CA"
                  />
                  <Input
                    label="ZIP Code"
                    type="text"
                    name="zipCode"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    error={errors.zipCode}
                    required
                    placeholder="12345"
                  />
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Payment</h2>

              {/* Stripe Security Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  <span className="text-green-700 font-semibold">✓ Secure Payment:</span> This checkout uses Stripe for secure payment processing.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isProcessing}
              >
                {isProcessing ? 'Processing Order...' : `Place Order - ${formatCurrency(total)}`}
              </Button>

              <p className="text-xs text-gray-600 text-center mt-4">
                Look at your email for confirmation details from <strong>therapyequipped@gmail.com</strong> (check spam if you do not see immediately or contact support)
              </p>
            </section>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {items.map((item, index) => {
                const product = getProductById(item.productId);
                if (!product) return null;

                // Get the correct image based on color selection
                let productImage = product.images.main;
                if (item.selectedColor && product.hasColors && product.colors) {
                  const colorOption = product.colors.find(c => c.name === item.selectedColor);
                  if (colorOption) {
                    productImage = colorOption.images.main;
                  }
                }

                return (
                  <div key={`${item.productId}-${item.selectedColor}-${index}`} className="flex gap-3">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      {item.selectedColor && (
                        <p className="text-xs text-gray-600">{item.selectedColor}</p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(product.price * item.quantity)}</p>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
                <span>🔒</span>
                <span>Secure Checkout</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
