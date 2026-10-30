## Domains

Use the project's deployment configuration and runbook for its actual canonical hostnames and authoritative DNS/provider ownership. For ArcNet, service domains live in `.arcnet/arcnet.yaml`; do not assume historical Terraform files control the current deployment.

A domain change must account for application URLs, CORS, auth callbacks, redirects and external integrations. Verify provider mappings, DNS, TLS and application health before retiring a working hostname. Use provider-reported DNS targets, not copied account-specific values.

Setup and updates: `fm read extensions/custom-domains/README.md --store mp-lb/fssstack`.

The canonical registry/docs hostname is `shad.mp-lb.dev`, declared under the `docs` Vercel site in `.arcnet/arcnet.yaml`. ArcNet’s deployment consumer uses the configured Vercel and Cloudflare credentials. Preserve registry URLs under `/r/` when changing domain or hosting configuration.
