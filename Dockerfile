FROM oven/bun:0.7.1

ARG PORT=8080
ENV PORT=$PORT

COPY . .

RUN bun install

ENTRYPOINT ["bun", "src/index.ts"]