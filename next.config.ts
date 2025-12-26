import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nanubhai.allaboutcraftbd.shop",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nanubhaiecom-server.onrender.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  // Enable static exports if you want to deploy as a static site
  //output: 'export',
  //trailingSlash: true,
  // images: {
  //   unoptimized: true
  // }
};

export default nextConfig;
