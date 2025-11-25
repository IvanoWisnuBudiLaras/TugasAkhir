﻿﻿﻿﻿﻿FROM node:20-alpine AS base

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

# Development stage
FROM base AS development

WORKDIR /app

EXPOSE 3000

CMD ["pnpm", "dev"]

# Production stage untuk Fly.io
FROM node:20-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies
RUN npm install -g pnpm@10.20.0 && pnpm install --prod --frozen-lockfile

# Copy standalone build (hemat space)
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=base --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check endpoint
RUN echo 'module.exports = function handler(req, res) { res.status(200).json({ status: "ok", service: "frontend" }); }' > /app/pages/api/health.js

CMD ["node", "server.js"]