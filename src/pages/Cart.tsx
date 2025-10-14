import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { CartItem } from '../components/cart/CartItem';
import { formatCurrency } from '../utils/formatting';
import { FREE_SHIPPING_THRESHOLD } from '../utils/calculations';

export const Cart = () => {
  const { items, subtotal, shipping, total, freeShippingRemaining } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Start shopping to add items to your cart
          </p>
          <Link to="/shop">
            <Button variant="primary" size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {/* Free Shipping Progress */}
          {freeShippingRemaining > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Add <strong>{formatCurrency(freeShippingRemaining)}</strong> more to get free shipping!
              </p>
              <div className="mt-2 bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div>
            {items.map((item, index) => (
              <CartItem key={`${item.productId}-${item.selectedColor || 'default'}-${index}`} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
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

            <Link to="/checkout">
              <Button variant="primary" size="lg" fullWidth>
                Proceed to Checkout
              </Button>
            </Link>

            <Link to="/shop" className="block text-center mt-4 text-gray-600 hover:text-brand-black">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
