import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

// Load .env file explicitly
config({ path: '.env' })

export default defineConfig({
  datasource: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL,
  },
})