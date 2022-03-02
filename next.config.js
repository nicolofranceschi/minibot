/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    scope: '/',
    runtimeCaching,
    disable: process.env.NODE_ENV === 'development',
    buildExcludes: [/middleware-manifest\.json$/],
  },
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
});
