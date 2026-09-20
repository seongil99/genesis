# One toolchain end to end: bun builds the app and runs the adapter-node output.
FROM oven/bun:1-alpine AS build

WORKDIR /app

# Dependencies first so a source-only change doesn't reinstall them.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# The project declares no runtime dependencies — adapter-node bundles everything
# the server needs — so the build output and package.json are the whole app.
COPY --from=build /app/build ./build
COPY package.json ./

USER bun
EXPOSE 3000

CMD ["bun", "./build/index.js"]
