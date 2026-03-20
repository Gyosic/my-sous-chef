FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

# ── prune ──
FROM base AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune api --docker

# ── build ──
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm build --filter=api

# ── runner ──
FROM node:22-alpine
WORKDIR /app

# webpack 번들이므로 main.js 하나만 필요
COPY --from=builder /app/apps/api/dist/main.js ./main.js

ENV PORT=4000
EXPOSE 4000

CMD ["node", "main.js"]
