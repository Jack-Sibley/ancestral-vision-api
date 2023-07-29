FROM oven/bun:0.7.1

COPY . .

RUN bun install

ENTRYPOINT ["bun", "src/index.ts"]