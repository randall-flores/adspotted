/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep visited pages in the client router cache so back/forward
    // navigation restores instantly instead of refetching the feed.
    staleTimes: {
      dynamic: 180,
      static: 300,
    },
  },
};
export default nextConfig;
