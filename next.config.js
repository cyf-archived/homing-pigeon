const { withContentlayer } = require("next-contentlayer");

const basePath =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "/homing-pigeon" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "visitor-badge.laobi.icu",
      "vercel.com",
    ],
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
  },
  env: {
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_GOOGLE_ID: process.env.NEXT_PUBLIC_GOOGLE_ID,
    NEXT_PUBLIC_GH_TOKEN: process.env.NEXT_PUBLIC_GH_TOKEN,
    NEXT_PUBLIC_GH_REPO_OWNER: process.env.NEXT_PUBLIC_GH_REPO_OWNER,
    NEXT_PUBLIC_GH_REPO: process.env.NEXT_PUBLIC_GH_REPO,
    NEXT_PUBLIC_COOKIE_BANNER_ID: process.env.NEXT_PUBLIC_COOKIE_BANNER_ID,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  },
};

module.exports = withContentlayer(nextConfig);
