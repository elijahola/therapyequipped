import type { Product } from '../types/index.js';

export const products: Product[] = [
  {
    id: 'tegun-pro',
    name: 'TEgun Pro',
    slug: 'tegun-pro',
    price: 49.00,
    shippingCost: 0, // Free shipping
    description: 'This gun gets the job done and won\'t kill your pockets like other massage guns on the market. Plus we offer lifetime guarantee on our products to protect your purchase. We make sure you\'re getting your end of the deal!',
    features: [
      '4 interchangeable attachment heads for targeted relief',
      '6 speed levels to customize your massage intensity',
      'Simple hold-to-power on/off operation',
      'USB-C charging with 3 hours of continuous use',
      '60W high torque motor for deep tissue massage',
      'Lightweight design perfect for travel',
    ],
    whatsIncluded: [
      'TEgun PRO massage gun',
      '4 Attachment heads',
      'TEgun travel pouch',
      'USB-C charger',
    ],
    hasColors: false,
    images: {
      main: `/images/products/tegun-pro/5.png`,
      lifestyle: [
        `/images/products/tegun-pro/lifestyle-1.png`,
        `/images/products/tegun-pro/lifestyle-2.png`,
        `/images/products/tegun-pro/lifestyle-3.png`,
      ],
      details: [
        `/images/products/tegun-pro/detail-1.png`,
        `/images/products/tegun-pro/detail-2.png`,
        `/images/products/tegun-pro/detail-3.png`,
        `/images/products/tegun-pro/detail-4.png`,
      ],
      whatsIncluded: `/images/products/tegun-pro/whats-included.png`,
    },
    category: 'massage-gun',
  },
  {
    id: 'tegun-lite',
    name: 'TEgun Lite',
    slug: 'tegun-lite',
    price: 39.00,
    shippingCost: 0, // Free shipping
    description: 'Our special lightweight version designed for on-the-go recovery and travel. All the power you need in a compact, portable design that fits anywhere.',
    features: [
      'Ultra-lightweight and compact design',
      'Perfect for travel and on-the-go use',
      'Powerful motor for effective massage',
      'Multiple speed settings',
      'Long-lasting battery life',
      'Quiet operation',
    ],
    whatsIncluded: [
      'TEgun Lite massage gun',
      'Attachment heads',
      'USB-C charger',
      'Carrying case',
    ],
    hasColors: true,
    colors: [
      {
        name: 'Green Goblin',
        hex: '#2D5F5D',
        images: {
          main: `/images/products/tegun-lite/main-green-goblin.png`,
          lifestyle: [
            `/images/products/tegun-lite/lifestyle-green-goblin-1.png`,
            `/images/products/tegun-lite/lifestyle-1.png`,
            `/images/products/tegun-lite/lifestyle-2.png`,
          ],
          details: [`/images/products/tegun-lite/detail-green-goblin-1.png`],
          whatsIncluded: `/images/products/tegun-lite/whats-included-green-goblin.png`,
        },
      },
      {
        name: 'Flash',
        hex: '#B24444',
        images: {
          main: `/images/products/tegun-lite/main-flash.png`,
          lifestyle: [
            `/images/products/tegun-lite/lifestyle-flash-1.png`,
            `/images/products/tegun-lite/lifestyle-1.png`,
            `/images/products/tegun-lite/lifestyle-3.png`,
          ],
          details: [`/images/products/tegun-lite/detail-flash-1.png`],
          whatsIncluded: `/images/products/tegun-lite/whats-included-flash.png`,
        },
      },
      {
        name: 'Venom',
        hex: '#4A5568',
        images: {
          main: `/images/products/tegun-lite/main-venom.png`,
          lifestyle: [
            `/images/products/tegun-lite/lifestyle-venom-1.png`,
            `/images/products/tegun-lite/lifestyle-1.png`,
            `/images/products/tegun-lite/lifestyle-2.png`,
          ],
          details: [
            `/images/products/tegun-lite/detail-venom-1.png`,
            `/images/products/tegun-lite/detail-venom-2.png`,
          ],
          whatsIncluded: `/images/products/tegun-lite/whats-included-venom.png`,
        },
      },
    ],
    images: {
      main: `/images/products/tegun-lite/main-green-goblin.png`,
      lifestyle: [
        `/images/products/tegun-lite/lifestyle-1.png`,
        `/images/products/tegun-lite/lifestyle-2.png`,
      ],
      details: [],
      whatsIncluded: `/images/products/tegun-lite/whats-included-green-goblin.png`,
    },
    category: 'massage-gun',
  },
  {
    id: 'teroller',
    name: 'TEroller',
    slug: 'teroller',
    price: 25.00,
    shippingCost: 5.00,
    description: 'Premium massage roller designed for arms, legs, and neck. Perfect for self-myofascial release and muscle recovery.',
    features: [
      'Textured surface for deep tissue massage',
      'Versatile use for arms, legs, and neck',
      'Durable construction',
      'Easy to clean',
      'Portable and lightweight',
      'Perfect for pre and post-workout',
    ],
    whatsIncluded: [
      'TEroller massage roller',
      'User guide',
    ],
    hasColors: false,
    images: {
      main: `/images/products/teroller/main.png`,
      lifestyle: [],
      details: [],
      whatsIncluded: `/images/products/teroller/main.png`,
    },
    category: 'roller',
  },
  {
    id: 'teboard',
    name: 'TEboard',
    slug: 'teboard',
    price: 25.00,
    shippingCost: 5.00,
    description: 'Revolutionary push-up board that enables different ranges and motions of push-ups you might not be used to. Build strength and muscle from multiple angles.',
    features: [
      'Multiple grip positions for varied workouts',
      'Color-coded muscle group targeting',
      'Non-slip design for safety',
      'Portable and foldable',
      'Suitable for all fitness levels',
      'Targets chest, shoulders, back, and triceps',
    ],
    whatsIncluded: [
      'TEboard exercise board',
      'Workout guide',
    ],
    hasColors: false,
    images: {
      main: `/images/products/teboard/main.png`,
      lifestyle: [],
      details: [],
      whatsIncluded: `/images/products/teboard/main.png`,
    },
    category: 'board',
  },
];

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((product) => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category);
};
