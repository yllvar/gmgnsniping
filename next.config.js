/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure proper static file handling
  trailingSlash: false,
  // Fix asset prefix for Vercel
  assetPrefix: "",
  // Ensure proper build output
  output: "standalone",
  // Experimental features for better compatibility
  experimental: {
    serverComponentsExternalPackages: ["@solana/web3.js"],
  },
  // Enhanced webpack configuration
  webpack: (config, { isServer }) => {
    // Handle node modules that don't work in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }

    // Ensure proper handling of ES modules
    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    })

    return config
  },
}

module.exports = nextConfig
