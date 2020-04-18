const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withPWA = require("next-pwa");

module.exports = withBundleAnalyzer(
  withPWA({
    pwa: {
      dest: "public",
      swSrc: "service-worker.js",
      publicExcludes: [
        "!android-chrome-*.png",
        "!apple-touch-icon-*.png",
        "!favicon*",
        "!maskable-icon.png",
        "!manifest.json",
      ],
    },
    experimental: {
      reactMode: "concurrent",
    },
    env: {
      SITE_URL: process.env.SITE_URL,
    },
  })
);
