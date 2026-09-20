# genesis

## Local nginx proxy

`docker-compose.yml` runs an nginx container that fronts the SvelteKit dev server, so the
site is reachable on `http://localhost:8080` (and over Tailscale) instead of Vite's `:5173`.
The app is not containerised — nginx proxies back out to the dev server on the host, which
keeps HMR working.

```bash
bun run dev --host 0.0.0.0 --port 5173   # in one shell
docker compose up -d                     # in another
```

The `--host` flag matters: without it Vite binds to loopback only and the container cannot
reach it. The proxy config lives in `docker/nginx/default.conf`; edit it and
`docker compose restart nginx` to pick it up.
