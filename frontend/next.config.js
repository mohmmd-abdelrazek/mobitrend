const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"], // Specify supported formats globally
    dangerouslyAllowSVG: true, // Enable SVG handling globally
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Strict CSP
  },
};

module.exports = withNextIntl(nextConfig);
