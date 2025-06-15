let userConfig = undefined
try {
  userConfig = await import('./my-user-next.config')
} catch (e) {
  // ignore error
}

// Helper function to merge configurations
function mergeConfig(baseConfig, userConfig) {
  if (!userConfig || typeof userConfig !== 'object') {
    return baseConfig
  }
  return { ...baseConfig, ...userConfig }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

export default mergeConfig(nextConfig, userConfig?.default || userConfig)
