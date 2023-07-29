FROM oven/bun:0.6.1
EXPOSE 3000

COPY . .

RUN bun install

CMD ["bun", "run", "src/index.ts"]