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
  if (!KEY) return;
  posthog.capture('$pageview', { $current_url: window.location.href });
};

export const track = (event: string, props?: Record<string, unknown>) => {
  if (!KEY) return;
  posthog.capture(event, props);
};
