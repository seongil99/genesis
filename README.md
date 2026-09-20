# genesis

## Running it

The site runs as two containers: the SvelteKit app (adapter-node, built and served by Bun —
see the `Dockerfile`) and an nginx reverse proxy in front of it. Only nginx is published — the app is reachable
just over the compose network.

```bash
cp .env.example .env   # then edit it
docker compose up -d --build
```

The site is then on `http://localhost:8080` (and over Tailscale, on the same port).

Without a `.env` the app falls back to the dev password and signing secret hardcoded in
`src/lib/server/auth.ts`, which anyone reading the repo can guess — set real values before
sharing the link. Changing either value invalidates existing sessions.

The proxy config lives in `docker/nginx/default.conf`; edit it and `docker compose restart
nginx` to pick it up. After changing app code, `docker compose up -d --build` to rebuild.

## Developing

`bun run dev` still serves the app directly on `:5173` with HMR, without Docker.
