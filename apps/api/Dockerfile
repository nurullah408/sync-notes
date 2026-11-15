
# Stage 1: Install workspace dependencies
FROM node:22-alpine AS deps

ENV CI=true

RUN corepack enable

WORKDIR /usr/src/app

# Copy the monorepo
COPY . .

# Install dependencies for the entire workspace
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM deps AS builder

# Generate Prisma Client
RUN pnpm --filter @sync-notes/api exec prisma generate

# Build shared package if it has a build script
# RUN pnpm --filter @sync-notes/lexical build

# Build NestJS API
RUN pnpm --filter @sync-notes/api build

# Stage 3: Production
FROM node:22-alpine AS runner

RUN corepack enable

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy workspace dependencies and build outputs
COPY --from=builder /usr/src/app ./

WORKDIR /usr/src/app/apps/api

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
