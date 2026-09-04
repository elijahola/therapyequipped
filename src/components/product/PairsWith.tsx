/**
 * Cross-sell strip on product pages: the bundle pitch, priced honestly.
 *
 * On a gun page: offer the accessories at their bundle price (15% off, since
 * adding them alongside the gun always qualifies). On an accessory page:
 * offer the Lite as the unlock ("add it and this drops 15%") plus the other
 * accessory. Every add is one tap and lands as a tracked cross_sell event.
 */
import { useNavigate } from 'react-router-dom';
import { getProductById } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatting';
import {
  ACCESSORY_IDS,
  BUNDLE_DISCOUNT_PCT,
  GUN_IDS,
  cartHasGun,
  discountedPrice,
  isAccessory,
} from '../../utils/bundles';
import { track } from '../../lib/analytics';

export const PairsWith = ({ productId }: { productId: string }) => {
  const { items, addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isGunPage = GUN_IDS.includes(productId);
  const suggestions = (isGunPage
    ? ACCESSORY_IDS
    : ['tegun-lite', ...ACCESSORY_IDS.filter((id) => id !== productId)]
  )
    .map(getProductById)
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .filter((p) => !items.some((i) => i.productId === p.id));

  if (suggestions.length === 0) return null;

  // Accessories show their bundle price when the bundle will apply: either a
  // gun is already in the cart, or the shopper is standing on a gun page
  // (adding from here pairs it with the gun they're about to buy).
  const bundleLikely = isGunPage || cartHasGun(items);

  const handleAdd = (id: string) => {
    const product = getProductById(id);
    if (!product) return;
    addItem(id, 1, product.colors?.[0]?.name);
    track('add_to_cart', {
      product_id: id,
      product_name: product.name,
      price: product.price,
      quantity: 1,
      value: product.price,
      from: 'cross_sell',
      source_product: productId,
    });
    showToast(
      isAccessory(id) && bundleLikely
        ? `Added ${product.name} — ${BUNDLE_DISCOUNT_PCT}% bundle discount applies at checkout!`
        : `Added ${product.name} to cart!`,
      'success'
    );
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-1">Complete your recovery kit</h2>
      <p className="text-gray-600 mb-6">
        {isGunPage
          ? `Add recovery accessories for ${BUNDLE_DISCOUNT_PCT}% off — and your whole order ships free.`
          : `Pair with a TEgun and save ${BUNDLE_DISCOUNT_PCT}% on your accessories.`}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {suggestions.map((p) => {
          const showDiscount = isAccessory(p.id) && bundleLikely;
          return (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
            >
              <img
                src={p.images.main}
                alt={p.name}
                className="h-20 w-20 cursor-pointer rounded-md object-cover"
                onClick={() => navigate(`/product/${p.slug}`)}
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{p.name}</p>
                {showDiscount ? (
                  <p className="text-sm">
                    <span className="text-gray-400 line-through">
                      {formatCurrency(p.price)}
                    </span>{' '}
                    <span className="font-bold text-green-700">
                      {formatCurrency(discountedPrice(p.price))}
                    </span>{' '}
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-800">
                      Save {BUNDLE_DISCOUNT_PCT}%
                    </span>
                  </p>
                ) : (
                  <p className="text-sm font-semibold">{formatCurrency(p.price)}</p>
                )}
              </div>
              <button
                onClick={() => handleAdd(p.id)}
                className="shrink-0 rounded-md bg-brand-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-80"
              >
                + Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
