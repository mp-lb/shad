# Shad registry playground

Vite/ShadCN consumer app for exercising registry components locally.

Run it from the repo root:

```bash
pnpm playground:dev
```

The root script rebuilds the local registry JSON and reinstalls registry items
into this app before Vite starts. The installed component snapshot is committed
so Tailwind v4 can scan it; edit the source files in `../../registry` and rerun
the install/build script to refresh the playground copy.
