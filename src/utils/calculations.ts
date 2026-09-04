import type { CartItem } from '../types/index.js';
import { getProductById } from '../data/products.js';
import { effectiveUnitPrice, calculateBundleSavings } from './bundles.js';

export { calculateBundleSavings };

export const FREE_SHIPPING_THRESHOLD = 30;

/**
 * Calculate the subtotal for cart items
 */
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const product = getProductById(item.productId);
    if (!product) return total;
    // Bundle-aware: accessories ride at 15% off when a TEgun is in the cart.
    return total + effectiveUnitPrice(items, item.productId) * item.quantity;
  }, 0);
};

/**
 * Calculate shipping cost based on cart items and subtotal
 * Free shipping if subtotal >= $30, otherwise sum of individual shipping costs
 */
export const calculateShipping = (items: CartItem[]): number => {
  const subtotal = calculateSubtotal(items);

  // Free shipping if subtotal is $30 or more
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  // Otherwise, calculate shipping for each unique product (not per quantity)
  const uniqueProducts = new Set(items.map(item => item.productId));
  let shipping = 0;

  uniqueProducts.forEach(productId => {
    const product = getProductById(productId);
    if (product) {
      shipping += product.shippingCost;
    }
  });

  return shipping;
};

/**
 * Calculate total (subtotal + shipping)
 */
export const calculateTotal = (items: CartItem[]): number => {
  const subtotal = calculateSubtotal(items);
  const shipping = calculateShipping(items);
  return subtotal + shipping;
};

/**
 * Calculate how much more is needed for free shipping
 */
export const calculateFreeShippingRemaining = (items: CartItem[]): number => {
  const subtotal = calculateSubtotal(items);
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return FREE_SHIPPING_THRESHOLD - subtotal;
};

/**
 * Get total item count in cart
 */
export const getCartItemCount = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};
