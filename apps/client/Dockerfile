# Build context: repository root (docker compose: context: ., dockerfile: apps/client/Dockerfile)
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Build-time env for Next.js (browser will call this API URL)
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy workspace manifests and client + ui + tools
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client/package.json apps/client/
COPY packages/ui/package.json packages/ui/
COPY packages/ packages/
COPY tools/ tools/

RUN pnpm install --frozen-lockfile

# Copy app source
COPY apps/client apps/client

# Build client (uses NEXT_PUBLIC_API_URL from ENV)
RUN pnpm --filter client build

WORKDIR /app/apps/client
CMD ["pnpm", "start"]
