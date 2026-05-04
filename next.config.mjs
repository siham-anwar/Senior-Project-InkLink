import { dirname } from 'path'
import { fileURLToPath } from 'url'

const workspaceRoot = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: workspaceRoot,
  }
}

export default nextConfig
