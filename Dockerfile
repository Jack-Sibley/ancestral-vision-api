FROM oven/bun:0.7.1

COPY . .

RUN bun install

EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]