FROM node:20-alpine AS base

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

# Production stage
FROM node:20-alpine AS production
RUN npm install -g pnpm@10.20.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=base /app/dist ./dist

EXPOSE 3001

CMD ["pnpm", "start:prod"]