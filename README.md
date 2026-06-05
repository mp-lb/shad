# @mp-lb/shad

shadcn registry for MP-LB components.

## Development

```bash
pnpm install
pnpm dev
```

## Playground

Use the Vite playground to test the registry as a real ShadCN consumer app:

```bash
pnpm playground:dev
```

The playground script rebuilds the local registry JSON and reinstalls every
registry item into `apps/playground` before starting Vite. Use
`pnpm playground:build` for a local consumer build check.

## Registry

Build registry JSON into the docs site's public directory:

```bash
pnpm registry:build
```

Install the structured log viewer from a deployed registry:

```bash
pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/structured-log-viewer.json
```
