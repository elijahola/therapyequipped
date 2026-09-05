// Product Types
export type ProductCategory = 'massage-gun' | 'roller' | 'board' | 'breathing';

export type ColorName = 'Green Goblin' | 'Flash' | 'Venom';

export interface Color {
  name: ColorName;
  hex: string;
  images: ProductImages;
}

export interface ProductImages {
  main: string;
  lifestyle: string[];
  details: string[];
  whatsIncluded: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  shippingCost: number;
  description: string;
  features: string[];
  whatsIncluded: string[];
  hasColors: boolean;
  colors?: Color[];
  images: ProductImages;
  category: ProductCategory;
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: ColorName;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

// Checkout Types
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: Date;
}

// Toast Notification Types
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}
