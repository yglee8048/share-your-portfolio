import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

/** @type {import('next').NextConfig} */

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {}
  return Object.fromEntries(
    readFileSync(filePath, 'utf-8')
      .split('\n')
      .filter(line => line && !line.startsWith('#') && line.includes('='))
      .map(line => {
        const [key, ...rest] = line.split('=')
        return [key.trim(), rest.join('=').trim()]
      }),
  )
}

const vercelEnv = process.env.VERCEL_ENV ?? 'development'
const envVars = parseEnvFile(resolve(process.cwd(), `.env.${vercelEnv}`))

const nextConfig = {
  reactStrictMode: true,
  env: envVars,
}

export default nextConfig
