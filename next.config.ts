/** @type {import('next').NextConfig} */
const nextConfig = {
  serverActions: {
    timeout: 20000, // 20 seconds
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
