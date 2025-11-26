﻿﻿﻿﻿﻿﻿﻿FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.20.0

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Generate Prisma Client
RUN pnpm prisma generate

# Development stage
FROM base AS development

WORKDIR /app

EXPOSE 3001

CMD ["pnpm", "start:dev"]

# Production stage untuk Render.com
FROM node:20-alpine AS production
RUN npm install -g pnpm@10.20.0

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S smoethie -u 1001

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application and Prisma files
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma

# Create health check endpoint
RUN echo 'export async function handler(req, res) { res.status(200).json({ status: "ok" }); }' > /app/dist/health.js

# Change ownership to non-root user
RUN chown -R smoethie:nodejs /app
USER smoethie

EXPOSE 8080

CMD ["pnpm", "start:prod"]