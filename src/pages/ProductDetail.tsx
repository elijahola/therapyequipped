import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus } from 'lucide-react';
import { getProductBySlug, products } from '../data/products';
import { track } from '../lib/analytics';
import { ProductGallery } from '../components/product/ProductGallery';
import { ColorSelector } from '../components/product/ColorSelector';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatting';
import type { ColorName } from '../types/index.js';

export const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  const [selectedColor, setSelectedColor] = useState<ColorName | undefined>(
    product?.colors?.[0]?.name
  );
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { showToast } = useToast();

  // Funnel: someone landed on this product page.
  useEffect(() => {
    if (product) {
      track('product_viewed', {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
      });
    }
  }, [product]);

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  const handleColorChange = (color: ColorName) => {
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    addItem(product.id, quantity, selectedColor);
    track('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity,
      color: selectedColor,
      value: product.price * quantity,
    });
    showToast(`Added ${quantity}x ${product.name} to cart!`, 'success');
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Get all images for gallery
  const galleryImages = product.hasColors && selectedColor && product.colors
    ? product.colors.find((c) => c.name === selectedColor)?.images.main
      ? [
          product.colors.find((c) => c.name === selectedColor)!.images.main,
          ...product.colors.find((c) => c.name === selectedColor)!.images.lifestyle,
          ...product.colors.find((c) => c.name === selectedColor)!.images.details,
        ]
      : [product.images.main, ...product.images.lifestyle, ...product.images.details]
    : [product.images.main, ...product.images.lifestyle, ...product.images.details];

  return (
    <div className="container-custom py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-brand-black">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/shop" className="hover:text-brand-black">
          Shop
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-black font-medium">{product.name}</span>
      </nav>

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div>
          <ProductGallery images={galleryImages} productName={product.name} />
        </div>

        {/* Right: Product Info */}
        <div className="lg:sticky lg:top-24 self-start">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

          {/* Price */}
          <div className="mb-6">
            <p className="text-4xl font-bold">{formatCurrency(product.price)}</p>
            {product.shippingCost === 0 ? (
              <p className="text-success font-semibold mt-2">Free Shipping</p>
            ) : (
              <p className="text-gray-600 mt-2">+ {formatCurrency(product.shippingCost)} shipping</p>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

          {/* Color Selector */}
          {product.hasColors && product.colors && (
            <div className="mb-6">
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor!}
                onColorChange={handleColorChange}
              />
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quantity
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
              <button
                onClick={decrementQuantity}
                className="p-3 hover:bg-gray-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="px-6 font-semibold text-lg">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="p-3 hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="space-y-3">
            <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart}>
              Add to Cart - {formatCurrency(product.price * quantity)}
            </Button>
            <Link to="/cart" className="block">
              <Button variant="secondary" size="lg" fullWidth>
                Go to Cart
              </Button>
            </Link>
          </div>

          {/* Guarantees */}
          <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-success text-xl">✓</span>
              <div>
                <h3 className="font-semibold">Lifetime Guarantee</h3>
                <p className="text-sm text-gray-600">We stand behind our products forever</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-success text-xl">✓</span>
              <div>
                <h3 className="font-semibold">30-Day Money Back</h3>
                <p className="text-sm text-gray-600">Not satisfied? Get a full refund</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-success text-xl">✓</span>
              <div>
                <h3 className="font-semibold">Secure Checkout</h3>
                <p className="text-sm text-gray-600">Safe and encrypted payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products
            .filter((p) => p.id !== product.id && p.category === product.category)
            .slice(0, 3)
            .map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          {products.filter((p) => p.id !== product.id && p.category === product.category).length === 0 && (
            <p className="text-gray-600 col-span-3">
              Check out our other products in the{' '}
              <Link to="/shop" className="text-brand-black font-semibold hover:underline">
                shop
              </Link>
              !
            </p>
          )}
        </div>
      </div>

      {/* Product Details Sections */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Features */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          <ul className="space-y-3">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What's Included */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">What's Included</h2>
          <ul className="space-y-3">
            {product.whatsIncluded.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
