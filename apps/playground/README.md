# Shad registry playground

Vite/ShadCN consumer app for exercising registry components locally.

Run it from the repo root:

```bash
pnpm playground:dev
```

The root script rebuilds the local registry JSON and reinstalls registry items
into this app before Vite starts. Generated installed components are ignored by
git on purpose; edit the source files in `../../registry` instead.
