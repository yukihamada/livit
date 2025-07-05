# Livit Web Frontend Dockerfile
FROM node:18-alpine AS base

# pnpm を有効化
RUN corepack enable

WORKDIR /app

# システム依存関係をインストール
RUN apk add --no-cache libc6-compat

# 依存関係ファイルをコピー
COPY package*.json yarn.lock* ./

# 依存関係段階
FROM base AS deps
ENV NODE_ENV=development
RUN yarn install --frozen-lockfile

# ビルド段階
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 環境変数設定（ビルド時）
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV=production

# Next.js アプリをビルド
RUN yarn build

# 本番段階
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# セキュリティのため非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 公開ディレクトリをコピー
COPY --from=builder /app/public ./public

# ビルド出力をコピー
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 非rootユーザーに切り替え
USER nextjs

# ポート3000を公開
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# アプリを起動
CMD ["node", "server.js"]