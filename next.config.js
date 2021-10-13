/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  poweredByHeader: false,
  distDir: 'build',
  productionBrowserSourceMaps: false,
  // reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
};

module.exports = withPlugins([withBundleAnalyzer], nextConfig);
