# @mp-lb/shad

shadcn registry for MP-LB components.

## Development

```bash
pnpm install
pnpm dev
```

## Registry

Build registry JSON into the docs site's public directory:

```bash
pnpm registry:build
```

Install the structured log viewer from a deployed registry:

```bash
pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/structured-log-viewer.json
```
