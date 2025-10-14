import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Product, ColorName } from '../../types/index.js';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatting';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const [selectedColor, setSelectedColor] = useState<ColorName | undefined>(
    product.colors?.[0]?.name
  );
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addItem(product.id, 1, selectedColor);
    showToast(`${product.name} added to cart!`, 'success');
  };

  const displayImage = product.hasColors && product.colors && selectedColor
    ? product.colors.find(c => c.name === selectedColor)?.images.main || product.images.main
    : product.images.main;

  return (
    <div
      className={`
        group bg-white rounded-lg overflow-hidden transition-all duration-300
        ${featured
          ? 'border-3 border-brand-black shadow-lg hover:shadow-2xl ring-2 ring-brand-black ring-offset-2'
          : 'shadow-sm hover:shadow-xl'
        }
      `}
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/placeholders/product-placeholder.svg';
          }}
        />
        {featured && (
          <div className="absolute top-4 left-4 bg-brand-black text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide">
            BEST SELLER
          </div>
        )}
        {product.shippingCost === 0 && (
          <div className={`absolute top-4 ${featured ? 'left-4 mt-12' : 'right-4'} bg-success text-white px-3 py-1 rounded-full text-sm font-semibold`}>
            Free Shipping
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-gray-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-2xl font-bold mb-3">{formatCurrency(product.price)}</p>

        {/* Color Selector (only for products with colors) */}
        {product.hasColors && product.colors && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Color: {selectedColor}</p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all
                    ${selectedColor === color.name
                      ? 'border-brand-black scale-110'
                      : 'border-gray-300 hover:border-gray-400'}
                  `}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart */}
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
