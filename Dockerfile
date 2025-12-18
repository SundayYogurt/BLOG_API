FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies first for better caching
COPY package.json bun.lock* tsconfig.json ./
RUN bun install --frozen-lockfile

# Copy application source
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "run", "index.ts"]
