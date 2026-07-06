/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dfoqasqnw/image/upload/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // Next 15.5+ can truncate multipart bodies in server actions without this
    proxyClientMaxBodySize: "10mb",
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;