import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'
import * as path from 'path'

// Load .env file explicitly
config({ path: path.resolve(__dirname, '../.env') })

export default defineConfig({
  datasource: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/smoethievibes',
    directUrl: process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL || 'postgresql://localhost:5432/smoethievibes',
  },
})