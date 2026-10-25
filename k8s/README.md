# Kubernetes (k3s on Tailscale)

Manifests for the cluster described in `~/k3s-tailscale`: namespace `genesis`, an `app`
Deployment (the SvelteKit server) behind an `nginx` Deployment, both pinned to `gce-node`.
`kubectl apply -k k8s` renders and applies everything; Argo CD can point at this directory.

The site is served at `https://seonyoon.dev/aira/2027/`, so the image has to be built with that
base path (it is baked in at build time, and the probes use it):

```bash
docker buildx build --platform linux/amd64 --build-arg BASE_PATH=/aira/2027 \
  -t ghcr.io/seongil99/genesis:<tag> --push .
```

Then set `images[0].newTag` in `kustomization.yaml` to `<tag>`.

## One-time setup (not in Git)

```bash
export KUBECONFIG=~/.kube/k3s-tailscale.yaml
kubectl create namespace genesis
kubectl -n genesis create secret generic genesis-env \
  --from-literal=BIRTHDAY_PASSWORD='...' --from-literal=AUTH_SECRET="$(openssl rand -hex 32)"
# GHCR pull secret, same as the seonyoondev namespace (classic PAT, read:packages)
kubectl -n genesis create secret docker-registry ghcr-pull \
  --docker-server=ghcr.io --docker-username=seongil99 --docker-password='<PAT>'
```

## Routing on gce-node

The host nginx (`/etc/nginx/conf.d/seonyoondev.conf`, not managed by Git) sends everything to the
seonyoondev NodePort. Add this to the `seonyoon.dev` server block to send the sub-path here
(NodePort 30002). The path is passed through unchanged, and the forwarded headers are what lets
the app's CSRF check accept form POSTs:

```nginx
location ~ ^/aira/2027(/|$) {
    proxy_pass http://127.0.0.1:30002;
    proxy_set_header Host              $host;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host  $http_host;
}
```
