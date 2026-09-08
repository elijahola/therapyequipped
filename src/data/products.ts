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
  {
id: 'breathing-strips',
    name: 'Breathing Strips — 60 Pack (Black)',
    slug: 'breathing-strips',
    price: 15.99,
    // $4.50 single-box shipping: two boxes ($31.98) crosses the $30
    // free-shipping threshold — the bundle nudge.
    shippingCost: 4.5,
    description: 'Extra-strength, drug-free nasal strips with a reinforced triple elastic band that physically opens your nasal passages — 50% stronger lift for easier breathing during sleep, exercise, and travel. Oil-proof, sweat-resistant adhesive stays put all night; hypoallergenic and easy to remove. 60 black strips per box — two months of better nights.',
    features: [
      'Reinforced triple elastic band — 50% stronger lift',
      'Oil-proof & sweat-resistant adhesive stays on through sleep and workouts',
      'Drug free: nothing to take, nothing inside your nose',
      'Hypoallergenic, skin-friendly material with easy removal',
      'Universal fit (2.36 × 0.9 in) — spring-like bands flex with each breath',
      '60 strips per box — a two-month supply',
    ],
    whatsIncluded: ['60 individually wrapped black nasal strips'],
    hasColors: false,
    images: {
      main: `/images/products/breathing-strips/main-black-60.png`,
      lifestyle: [
        `/images/products/breathing-strips/sleep.png`,
        `/images/products/breathing-strips/gym.png`,
        `/images/products/breathing-strips/versatile.png`,
      ],
      details: [
        `/images/products/breathing-strips/before-after.png`,
        `/images/products/breathing-strips/layers.png`,
        `/images/products/breathing-strips/specs.png`,
        `/images/products/breathing-strips/usage.png`,
      ],
      whatsIncluded: `/images/products/breathing-strips/main-black-60.png`,
    },
    category: 'breathing',
  },
  {
    id: 'pickleball-set',
    name: 'Pickleball Set — 2 Paddles, 3 Balls & Carry Bag',
    slug: 'pickleball-set',
    price: 49.99,
    shippingCost: 0, // Free shipping — margin carries it at this AOV
    description: 'Everything two people need to play their first game this weekend. Two USAPA-approved graphite-face paddles with a lightweight polymer honeycomb core (7.25 oz), three high-visibility balls for indoor and outdoor courts, and a heavy-duty carry bag that keeps it all together. Grab a friend, find a court, and you’re playing in minutes.',
    features: [
      '2 USAPA-approved paddles — graphite carbon fiber face for power and spin control',
      'Lightweight polymer honeycomb core, 7.25 oz — easy on the wrist for long sessions',
      'Soft cushion non-slip grip stays comfortable through extended play',
      '3 high-visibility balls for indoor and outdoor courts, in most light conditions',
      'Heavy-duty carry bag fits paddles and balls — car trunk to court',
      'Complete set for all skill levels: unbox and play the same day',
    ],
    whatsIncluded: [
      '2 pickleball paddles (red + blue)',
      '3 high-visibility pickleballs (indoor/outdoor)',
      'Heavy-duty carry bag',
    ],
    hasColors: false,
    images: {
      main: `/images/products/pickleball-set/main.png`,
      lifestyle: [
        `/images/products/pickleball-set/play.png`,
        `/images/products/pickleball-set/bag.png`,
      ],
      details: [
        `/images/products/pickleball-set/materials.png`,
        `/images/products/pickleball-set/usapa.png`,
        `/images/products/pickleball-set/balls.png`,
        `/images/products/pickleball-set/specs.png`,
      ],
      whatsIncluded: `/images/products/pickleball-set/main.png`,
    },
    category: 'pickleball',
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
