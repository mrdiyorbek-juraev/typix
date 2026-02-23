import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
  images: {
    localPatterns: [
      { pathname: "/api/og/**" },
      { pathname: "/api/illustration/**" },
    ],
  },
};

export default withMDX(config);
