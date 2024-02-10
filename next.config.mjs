/** @type {import('next').NextConfig} */

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io"
      },
      {
        hostname: "lh3.googleusercontent.com"
      },
    ],
  },
  serverRuntimeConfig: {
    prisma,
  },
};

export default nextConfig;
