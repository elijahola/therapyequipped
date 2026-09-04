import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, ColorName } from '../types/index.js';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  calculateBundleSavings,
  calculateSubtotal,
  calculateShipping,
  calculateTotal,
  getCartItemCount,
  calculateFreeShippingRemaining,
} from '../utils/calculations';

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity?: number, color?: ColorName) => void;
  removeItem: (productId: string, color?: ColorName) => void;
  updateQuantity: (productId: string, quantity: number, color?: ColorName) => void;
  clearCart: () => void;
  subtotal: number;
  bundleSavings: number;
  shipping: number;
  total: number;
  itemCount: number;
  freeShippingRemaining: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useLocalStorage<CartItem[]>('therapy-equipped-cart', []);

  // Helper function to find item index
  const findItemIndex = (productId: string, color?: ColorName): number => {
    return items.findIndex(
      (item) => item.productId === productId && item.selectedColor === color
    );
  };

  const addItem = (productId: string, quantity: number = 1, color?: ColorName) => {
    setItems((prevItems) => {
      const existingIndex = findItemIndex(productId, color);

      if (existingIndex > -1) {
        // Item exists, update quantity
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            productId,
            quantity,
            selectedColor: color,
          },
        ];
      }
    });
  };

  const removeItem = (productId: string, color?: ColorName) => {
    setItems((prevItems) => {
      return prevItems.filter(
        (item) => !(item.productId === productId && item.selectedColor === color)
      );
    });
  };

  const updateQuantity = (productId: string, quantity: number, color?: ColorName) => {
    if (quantity <= 0) {
      removeItem(productId, color);
      return;
    }

    setItems((prevItems) => {
      const existingIndex = findItemIndex(productId, color);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity = quantity;
        return updated;
      }

      return prevItems;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = calculateSubtotal(items);
  const bundleSavings = calculateBundleSavings(items);
  const shipping = calculateShipping(items);
  const total = calculateTotal(items);
  const itemCount = getCartItemCount(items);
  const freeShippingRemaining = calculateFreeShippingRemaining(items);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    bundleSavings,
    shipping,
    total,
    itemCount,
    freeShippingRemaining,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
