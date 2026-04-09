# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Enable corepack (ships with Node)
RUN corepack enable

# Copy package files and install deps
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .

# Generate Prisma client (important!)
RUN pnpm prisma generate

# Build app
RUN pnpm run build

# Stage 2: Run
FROM node:22-alpine
WORKDIR /app

RUN corepack enable

# Copy only built files + deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Prisma needs schema for migrations (optional if you run migrate separately)
COPY --from=builder /app/prisma ./prisma

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/index.js"]
