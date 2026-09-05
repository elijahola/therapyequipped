/**
 * Per-product narrative content for the product pages: the story that sells,
 * told with the brand's own photography and REAL review quotes (lifted from
 * the site's Testimonials page — never invented).
 */
export interface StoryBlock {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
}

export interface ProductStory {
  kicker: string;
  headline: string;
  blocks: StoryBlock[];
  quote?: { text: string; name: string; product: string };
}

export const productStories: Record<string, ProductStory> = {
  'breathing-strips': {
    kicker: 'BREATHE BETTER, RECOVER BETTER',
    headline: 'The cheapest performance upgrade you\u2019ll ever make',
    blocks: [
      {
        title: 'A reinforced triple elastic band does the work',
        body: 'The triple elastic band physically expands your nasal passages from the outside \u2014 50% stronger lift for more air through the nose during sleep, training, and travel. Drug free: nothing to take, nothing inside your nose, nothing to charge.',
        image: '/images/products/breathing-strips/main-black-60.png',
        imageAlt: '60-pack of black extra-strength nasal strips',
      },
      {
        title: 'Stays on through the sweat',
        body: 'Oil-proof, sweat-resistant adhesive holds through a full night or a full game \u2014 and the hypoallergenic material peels off clean in the morning. Sixty individually wrapped strips per box; two boxes ship free.',
        image: '/images/community/recover.jpg',
        imageAlt: 'Recover, recover, recover',
      },
    ],
  },
  'tegun-lite': {
    kicker: 'BUILT FOR THE GO',
    headline: 'Recovery that fits your life, not the other way around',
    blocks: [
      {
        title: 'From the locker room to your carry-on',
        body: 'The Lite weighs about as much as a water bottle and disappears into a gym bag. Four attachment heads cover every muscle group — flat for big muscles, bullet for knots, fork for the spine line, ball for everything else.',
        image: '/images/hero/hero1.jpg',
        imageAlt: 'Athlete using the TEgun in the locker room',
      },
      {
        title: 'Three hours of battery. Zero excuses.',
        body: "Charge it over USB-C like your phone. Then warm up before the game, flush your legs after, and it's still going at the end of the week. Quiet enough to use courtside without turning heads.",
        image: '/images/ugc/courtside.jpg',
        imageAlt: 'Customer using the TEgun Lite courtside after practice',
      },
    ],
    quote: {
      text: 'Love my Green Goblin TEgun Lite! Perfect for travel and works just as well as the bulkier options.',
      name: 'Sarah Mitchell',
      product: 'TEgun Lite',
    },
  },
  'tegun-pro': {
    kicker: 'THE DEEP-TISSUE WORKHORSE',
    headline: 'Six speeds. One job: get you back out there.',
    blocks: [
      {
        title: 'Power that earns the name PRO',
        body: 'Six percussion speeds run from gentle warm-up to deep-tissue work that reaches what foam rolling never touches. The ergonomic grip keeps your wrist neutral, so working your own back does not become its own workout.',
        image: '/images/products/tegun-pro/lifestyle-1.png',
        imageAlt: 'TEgun Pro in use',
      },
      {
        title: 'Everything in the bag',
        body: 'Attachment heads for every muscle group, a charger, and a carry bag that keeps it all together — from home gym to away games.',
        image: '/images/products/tegun-pro/whats-included.png',
        imageAlt: 'Everything included with the TEgun Pro',
      },
    ],
    quote: {
      text: 'Best massage gun I’ve owned. The battery life is incredible and it hits all the right spots after my workouts.',
      name: 'Marcus Johnson',
      product: 'TEgun Pro',
    },
  },
  teroller: {
    kicker: 'TARGETED RELIEF, NO BATTERIES',
    headline: 'The simplest tool in the kit is the one you’ll use every day',
    blocks: [
      {
        title: 'Made for arms, legs, and neck',
        body: 'Textured rollers deliver self-myofascial release exactly where you aim them — IT bands, calves, forearms, traps. No charging, no settings, nothing to think about. Throw it in the bag and roll out anywhere.',
        image: '/images/community/back-work.jpg',
        imageAlt: 'Deep tissue work on the upper back',
      },
    ],
    quote: {
      text: 'Simple but effective. Use it every day for my IT band and calves. The price point is unbeatable for the quality.',
      name: 'David Chen',
      product: 'TEroller',
    },
  },
  teboard: {
    kicker: 'STRENGTH FROM EVERY ANGLE',
    headline: 'Push-ups you can’t get from the floor',
    blocks: [
      {
        title: 'Color-coded targeting',
        body: 'Slot the non-slip handles into color-coded positions to shift the work between chest, shoulders, back, and triceps. Same push-up, different muscle — the board makes the angles the floor can’t.',
        image: '/images/products/teboard/main.png',
        imageAlt: 'TEboard push-up board with color-coded slots',
      },
    ],
    quote: {
      text: 'Game changer for my home workouts! The different positions really target different muscle groups.',
      name: 'Jennifer Williams',
      product: 'TEboard',
    },
  },
};
