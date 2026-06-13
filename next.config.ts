import type { NextConfig } from "next";

/**
 * Allow next/image to optimize binary assets served by the dotCMS instance
 * (e.g. `/dA/<identifier>/...` image fields).
 *
 * Next.js 16 deprecated `images.domains` in favour of `images.remotePatterns`,
 * so we derive the allowed host from the same env var the SDK client uses.
 * That keeps the config in lockstep with whatever environment you point at —
 * no second place to update when you switch dotCMS instances.
 */
function dotcmsRemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    // dotCMS cloud-hosted environments (cloud.dotcms.dev spins these up).
    { protocol: "https", hostname: "**.dotcms.cloud" },
    { protocol: "https", hostname: "**.dotcms.dev" },
    { protocol: "https", hostname: "**.dotcms.site" },
  ];

  const host = process.env.NEXT_PUBLIC_DOTCMS_HOST;
  if (host) {
    try {
      const { protocol, hostname } = new URL(host);
      patterns.push({
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
      });
    } catch {
      // Malformed host — fall back to the cloud wildcards above.
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Turbopack doesn't pick up an
  // unrelated lockfile from a parent directory.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: dotcmsRemotePatterns(),
  },
};

export default nextConfig;
