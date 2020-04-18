/* eslint-disable no-restricted-globals */

import { skipWaiting, clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import {
  NetworkOnly,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import {
  registerRoute,
  setDefaultHandler,
  setCatchHandler,
} from "workbox-routing";
import {
  matchPrecache,
  precacheAndRoute,
  cleanupOutdatedCaches,
} from "workbox-precaching";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

import { v4 } from "uuid";

// Fine since not lazy loading versioned resources
skipWaiting();
clientsClaim();

// must include following lines when using inject manifest module from workbox
// https://developers.google.com/web/tools/workbox/guides/precache-files/workbox-build#add_an_injection_point
const WB_MANIFEST = self.__WB_MANIFEST;
// Precache fallback route and image
WB_MANIFEST.push({
  url: "/fallback",
  revision: v4(),
});
precacheAndRoute(WB_MANIFEST);

cleanupOutdatedCaches();

registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*/i,
  new StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  }),
  "GET"
);

registerRoute(
  /^https:\/\/fonts\.gstatic\.com\/.*/i,
  new CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  }),
  "GET"
);

registerRoute(
  /\.js$/i,
  new CacheFirst({
    cacheName: "static-js-assets",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 31536e3,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET"
);

registerRoute(
  /^.*(?:(?:(?:android-chrome-|apple-touch-icon-)\d+x\d+|)|maskable-icon)\.png$/i,
  new StaleWhileRevalidate({
    cacheName: "pwa-icons",
  }),
  "GET"
);

registerRoute(
  /^.*favicon.*\.(?:png|ico)$/i,
  new StaleWhileRevalidate({
    cacheName: "favicons",
  }),
  "GET"
);

registerRoute(
  /^.*manifest\.json$/,
  new StaleWhileRevalidate({
    cacheName: "manifest",
  }),
  "GET"
);

// following lines gives you control of the offline fallback strategies
// https://developers.google.com/web/tools/workbox/guides/advanced-recipes#comprehensive_fallbacks

setDefaultHandler(new NetworkOnly());

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
setCatchHandler(({ event }) => {
  // The FALLBACK_URL entries must be added to the cache ahead of time, either
  // via runtime or precaching. If they are precached, then call
  // `matchPrecache(FALLBACK_URL)` (from the `workbox-precaching` package)
  // to get the response from the correct cache.
  //
  // Use event, request, and url to figure out how to respond.
  // One approach would be to use request.destination, see
  // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
  switch (event.request.destination) {
    case "document":
      // If using precached URLs:
      return matchPrecache("/fallback");

    default:
      return Response.error();
  }
});
