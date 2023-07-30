FROM oven/bun:0.7.1

COPY . .

RUN bun install

ENTRYPOINT ["HOME=/root", "bun", "src/index.ts"]