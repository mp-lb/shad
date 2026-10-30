# Shad

Component registry and documentation site. Registry sources live in `registry/`; `registry.json` declares installable artifacts.

### Related tooling

Shared tooling is developed in sibling checkouts under `~/Work`: Zapper (`zapper`) runs tasks, Forum (`forum`) provides `fm`, Tools (`tools`) provides ArcNet, and Stackforge (`stackforge`) owns setup conventions. When a change belongs in an owned dependency, inspect and update that source repository as needed, follow its `AGENTS.md`, then rebuild/relink the CLI or update the consuming dependency. Verify the command resolves to the intended build.

This is a full installation deploying the `docs` Vercel site at `shad.mp-lb.dev`. Its GitHub environment is `arcnet-production`; the `deploy` secret consumer supplies the configured Vercel and Cloudflare credentials.

Component tests belong in `tests/*.test.ts` and run with `zap t test`, using `tsx` and `tsconfig.tests.json` for docs aliases.

## Documentation

Keep Shad-specific documentation under `docs/`. Public component documentation is part of this project; shared standards and extensions stay in Forum.

This project has no dedicated Forum store or `.forum/` sync configuration. Read shared standards with `fm read <file>.md --store mp-lb/dev` (list them with `fm ls --store mp-lb/dev`). Read shared extensions with `fm read extensions/<extension>/README.md --store mp-lb/fssstack` (list them with `fm ls extensions --store mp-lb/fssstack`).


### Component documentation

The public site uses Next.js routes under `apps/docs/app/docs/components/` for the rendered component pages. Each registry component must have a page with its install command and a working, representative rendered example; use a client demo when the component is interactive. The source lives under `registry/` and `registry.json` defines the installable files and dependencies. The matching MDX entry under `apps/docs/content/docs/components/` supplies the docs navigation metadata; add it to `meta.json`. The docs sidebar is one flat list derived from that metadata, and `/docs` opens its first component. Avoid separate hard-coded component navigation lists.

When adding or changing a component, update the registry, its route, its demo, and its MDX navigation entry together. Run `pnpm registry:build` and `pnpm build` to verify the generated registry and docs. Review every component page for a usable example when reorganizing the docs.

## Delivery

Push `main` to publish the hosted component registry; check the deployment workflow and the changed component URL under `https://shad.mp-lb.dev/r/`.

## Project UI

This repository maintains a component registry. Preserve the actual registry files and consumer docs/playground structure; do not assume `apps/frontend` exists.

Installed shadcn component locations: `apps/playground/src/components/ui` (configuration: `apps/playground/components.json`, theme: `apps/playground/src/index.css`).

## Validation

For context changes run `zap task context-build` and review matching generated outputs. For component changes, follow the existing component documentation policy and run the configured registry/build checks.
