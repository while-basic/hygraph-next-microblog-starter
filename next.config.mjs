/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: false,
    webpack: (config, { isServer }) => {
        // Add any webpack configs if needed
        return config;
    },
};

export default nextConfig;
