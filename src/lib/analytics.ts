/**
 * PostHog analytics — same project/keys as the Vhyral (Railway) apps.
 *
 * Reads VITE_POSTHOG_KEY / VITE_POSTHOG_HOST at build time. Without a key
 * every helper is a no-op, so local dev without envs stays silent.
 *
 * Funnel vocabulary (keep names stable — dashboards depend on them):
 *   $pageview          every SPA route change (manual, capture_pageview off)
 *   product_viewed     product detail page opened
 *   add_to_cart        item added (from product page)
 *   checkout_started   checkout page opened with a non-empty cart
 *   order_placed       buyer submitted the checkout form
 *   purchase_completed order success page confirmed the order
 */
import posthog from 'posthog-js';

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || 'https://us.i.posthog.com';
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

// Meta Pixel: the ad set optimizes for landing-page views and purchases, and
// Meta can only see those through the pixel. Same funnel moments as PostHog,
// translated to Meta's standard event names.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

if (META_PIXEL_ID && typeof window !== 'undefined' && !window.fbq) {
  const fbq: any = function (...args: unknown[]) {
    // eslint-disable-next-line prefer-spread, prefer-rest-params
    fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  fbq('init', META_PIXEL_ID);
}

const metaPixel = (...args: unknown[]) => {
  if (META_PIXEL_ID && typeof window !== 'undefined' && window.fbq) window.fbq(...args);
};

/** PostHog event name -> Meta standard event + payload translation. */
const toMetaEvent = (event: string, props?: Record<string, unknown>) => {
  switch (event) {
    case 'product_viewed':
      return ['ViewContent', { content_ids: [props?.product_id], content_name: props?.product_name, content_type: 'product', value: props?.price, currency: 'USD' }] as const;
    case 'add_to_cart':
      return ['AddToCart', { content_ids: [props?.product_id], content_name: props?.product_name, content_type: 'product', value: props?.value, currency: 'USD' }] as const;
    case 'checkout_started':
      return ['InitiateCheckout', { num_items: props?.items, value: props?.total, currency: 'USD' }] as const;
    case 'purchase_completed':
      return ['Purchase', { num_items: props?.items, value: props?.total, currency: 'USD' }] as const;
    default:
      return null;
  }
};

if (KEY) {
  posthog.init(KEY, {
    api_host: HOST,
    // Manual pageviews: SPAs never fire real navigations, so the automatic
    // one would only count the first load.
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
  });
}

export const trackPageview = () => {
  if (KEY) posthog.capture('$pageview', { $current_url: window.location.href });
  metaPixel('track', 'PageView');
};

export const track = (event: string, props?: Record<string, unknown>) => {
  if (KEY) posthog.capture(event, props);
  const meta = toMetaEvent(event, props);
  if (meta) metaPixel('track', meta[0], meta[1]);
};
