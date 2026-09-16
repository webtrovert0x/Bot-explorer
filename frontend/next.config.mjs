/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["scan.bohr.life", "ipfs.io", "images.unsplash.com"],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    config.externals = [...(config.externals || []), "pino-pretty", "lokijs", "encoding"];
    
    // Ignore optional wagmi/tempo connectors if not installed
    config.resolve.alias = {
      ...config.resolve.alias,
      accounts: false,
    };

    return config;
  },
};

export default nextConfig;
