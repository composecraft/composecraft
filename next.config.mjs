/** @type {import('next').NextConfig} */
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const json = require("./package.json");

const nextConfig = {
        output: 'standalone',
        images: {
                remotePatterns: [new URL('https://directus.composecraft.com/assets/**')],
        },
        publicRuntimeConfig: {
                version: json.version,
        },
        async rewrites() {
                return [
                        {
                                source: "/mesures/static/:path*",
                                destination: "https://eu-assets.i.posthog.com/static/:path*",
                        },
                        {
                                source: "/mesures/:path*",
                                destination: "https://eu.i.posthog.com/:path*",
                        },
                ];
        },
        // This is required to support PostHog trailing slash API requests
        skipTrailingSlashRedirect: true,
};

export default nextConfig;
