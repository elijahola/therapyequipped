import { Minus, Plus, X } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types/index.js';
import { getProductById } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatting';
import { effectiveUnitPrice } from '../../utils/bundles';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { items } = useCart();
  const unit = effectiveUnitPrice(items, item.productId);
  const { updateQuantity, removeItem } = useCart();
  const product = getProductById(item.productId);

  if (!product) return null;

  const handleIncrement = () => updateQuantity(item.productId, item.quantity + 1, item.selectedColor);
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1, item.selectedColor);
    }
  };
  const handleRemove = () => removeItem(item.productId, item.selectedColor);

  const displayImage = product.hasColors && item.selectedColor && product.colors
    ? product.colors.find(c => c.name === item.selectedColor)?.images.main || product.images.main
    : product.images.main;

  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/placeholders/product-placeholder.svg';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            {item.selectedColor && (
              <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>
            )}
            <p className="text-sm text-gray-600 mt-1">{formatCurrency(unit)} each</p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="Remove item"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Mobile: Quantity and Price */}
        <div className="flex items-center justify-between mt-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={handleDecrement}
              className="p-2 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 font-medium min-w-[3ch] text-center">{item.quantity}</span>
            <button
              onClick={handleIncrement}
              className="p-2 hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Total Price */}
          <p className="text-xl font-bold">{formatCurrency(unit * item.quantity)}</p>
        </div>
      </div>
    </div>
  );
};
