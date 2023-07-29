FROM oven/bun:0.7.1

COPY . .

RUN bun install

CMD ["bun", "run", "src/index.ts"]