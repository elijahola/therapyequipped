/**
 * Bundle pricing: accessories are 15% off whenever a TEgun is in the cart.
 *
 * The discount is applied at the PRICE level (effectiveUnitPrice), so the
 * subtotal, Stripe line items, and receipts all agree — never a display-only
 * discount that surprises people at checkout.
 */
import type { CartItem } from '../types/index.js';
import { getProductById } from '../data/products.js';

export const BUNDLE_DISCOUNT_PCT = 15;
export const GUN_IDS = ['tegun-lite', 'tegun-pro'];
export const ACCESSORY_IDS = ['teroller', 'teboard'];

export const cartHasGun = (items: CartItem[]): boolean =>
  items.some((i) => GUN_IDS.includes(i.productId));

export const isAccessory = (productId: string): boolean =>
  ACCESSORY_IDS.includes(productId);

export const discountedPrice = (price: number): number =>
  Math.round(price * (100 - BUNDLE_DISCOUNT_PCT)) / 100;

/** The price this product actually costs given the rest of the cart. */
export const effectiveUnitPrice = (items: CartItem[], productId: string): number => {
  const product = getProductById(productId);
  if (!product) return 0;
  if (isAccessory(productId) && cartHasGun(items)) {
    return discountedPrice(product.price);
  }
  return product.price;
};

/** Total bundle savings across the cart (0 when no gun present). */
export const calculateBundleSavings = (items: CartItem[]): number => {
  if (!cartHasGun(items)) return 0;
  return items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    if (!product || !isAccessory(item.productId)) return sum;
    return sum + (product.price - discountedPrice(product.price)) * item.quantity;
  }, 0);
};
