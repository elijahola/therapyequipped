import { products } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';

export const Shop = () => {
  return (
    <div className="container-custom py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Shop All Products</h1>
        <p className="text-gray-600">
          Professional recovery tools backed by our lifetime guarantee
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            featured={product.id === 'tegun-pro'}
          />
        ))}
      </div>

      {/* Guarantees Section */}
      <div className="mt-16 pt-12 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-bold mb-2">Lifetime Guarantee</h3>
            <p className="text-gray-600">We stand behind our products forever</p>
          </div>
          <div>
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-bold mb-2">30-Day Money Back</h3>
            <p className="text-gray-600">Not satisfied? Get a full refund</p>
          </div>
          <div>
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-bold mb-2">Free Shipping Over $30</h3>
            <p className="text-gray-600">Fast delivery on qualifying orders</p>
          </div>
        </div>
      </div>
    </div>
  );
};
