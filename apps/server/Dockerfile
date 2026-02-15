# Build context: repository root (docker compose: context: ., dockerfile: apps/server/Dockerfile)
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Copy workspace manifests and server + tools (server depends on @tools/typescript)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/
COPY packages/ packages/
COPY tools/ tools/

# Install dependencies (from root)
RUN pnpm install --frozen-lockfile

# Copy server source
COPY apps/server apps/server

# Build server and rewrite path aliases in dist for plain node
RUN pnpm --filter server build
WORKDIR /app/apps/server
RUN npx tsc-alias -p tsconfig.json

# Production run: entrypoint runs seed then server
WORKDIR /app/apps/server
RUN chmod +x /app/apps/server/docker-entrypoint.sh
ENTRYPOINT ["/app/apps/server/docker-entrypoint.sh"]
