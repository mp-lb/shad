<!-- Standard -->
## Agent context

Shared agent instructions live in `context/`. `context/index.md` explicitly imports blocks with `@filename.md`, in order. Files that are not imported are not included.

Edit source blocks, not generated root files. To add a block, create it and add its import to the index. To remove one, remove the import and unused file. Keep rules short and specific to the actual project.

Run `zap task context-build` after changes. Review and commit the source changes together with `AGENTS.base.md`, `AGENTS.md`, and `CLAUDE.md`. Without personal additions, all three outputs should match. Missing shared imports are errors, not optional omissions.

Keep private and machine-specific instructions out of committed context. This project compiles shared blocks only; keep personal files out of its index. `zap task context-copy` restores the root agent files from the shared base.

Extensions are documented at `extensions/<extension>/README.md` in the FSS Stack source (read with `fm read extensions/<extension>/README.md --store mp-lb/fssstack`). Each extension owns its context and other payloads. When installing one, copy its context payload, adapt it to the project, add the import once, and rebuild. Merge updates into existing customized blocks instead of overwriting them.
# Shad

Component registry and documentation site. Registry sources live in `registry/`; `registry.json` declares installable artifacts.
## Standards

FSS Stack ships with MAP Lab's public engineering standards. Read relevant standards on demand with `fm read <file>.md --store mp-lb/dev`; list them with `fm ls --store mp-lb/dev`. Public FSS Stack setup standards and extension payloads are also available in Stackforge's `fssstack/` tree, published as `mp-lb/fssstack`.

Keep code focused and well organized, reuse domain schemas and shared components, and prefer sentence case for product copy and documentation. Follow project-specific architecture and validation policies. Record documentation sources and any Forum sync mapping in the documentation block; these standards do not require a project-specific or private Forum store.
## Code style

- Use PascalCase for components
- Files should have 1 export, and should be named the same. E.g. MyComponent lives in MyComponent.tsx
- Use camelCase for constants, functions, mongo collections
- Use train_case for typed strings
- File routers are an exception
- Generally 1 function/class per file

### Functional decomposition

Good functional decomposition is essential. This applies to react components, hooks, backend functions. Continuously abstract and centralise important code. Functions should be small and "do one thing".

### Code organization

Maintain an extreme approach to code organization. Functions/components should never be large or complex. Generally every function should have it's own file. Those files should be well organised. Continuously break down programs and organise files so that it's always crystal clear what modules relate to each other. You have permission to do this at all times. Flag concerns with the developer if unsure.

Take extra care when organizing tests.

### Tech debt

In general, follow the boy scout principle. But if you come across tech debt that's too big to address, add a .md doc to docs/tech-debt and raise it with the user.
## Development

Use Zapper for processes and tasks: `zap status`, `zap up`, `zap logs <service> --no-follow`, and `zap task <task>`. Inspect the existing stack before starting another copy. Services and tasks that need environment variables must receive Zapper's resolved environment.

Keep service names, dynamic ports and task commands in `zap.yaml`; do not hardcode development ports. Non-secret defaults live in `.env.local`; secrets belong in ignored `.env` or the configured secret source. Never put secret values in context.

The canonical tool versions are `.node-version` and `package.json#packageManager`; preserve them when changing local tooling or CI.
## Validation

For context changes run `zap task context-build` and review matching generated outputs. For component changes, follow the existing component documentation policy and run the configured registry/build checks.
## Scripts

Write project scripts in TypeScript in the package that owns the behaviour, or `packages/scripts` when there is no natural owner, and include them in normal lint and typecheck checks. Expose scripts through thin Zap tasks using `tsx`; component tests belong in `tests/*.test.ts` and run with `zap t test`, using `tsx` and `tsconfig.tests.json` for the docs aliases.
## Documentation

Keep Shad-specific documentation under `docs/`. Public component documentation is part of this project; shared standards and extensions stay in Forum.

This project has no dedicated Forum store or `.forum/` sync configuration. Read shared standards with `fm read <file>.md --store mp-lb/dev` (list them with `fm ls --store mp-lb/dev`). Read shared extensions with `fm read extensions/<extension>/README.md --store mp-lb/fssstack` (list them with `fm ls extensions --store mp-lb/fssstack`).


### Component documentation

The public site uses Next.js routes under `apps/docs/app/docs/components/` for the rendered component pages. Each registry component must have a page with its install command and a working, representative rendered example; use a client demo when the component is interactive. The source lives under `registry/` and `registry.json` defines the installable files and dependencies. The matching MDX entry under `apps/docs/content/docs/components/` supplies the docs navigation metadata; add it to `meta.json`. The docs sidebar is one flat list derived from that metadata, and `/docs` opens its first component. Avoid separate hard-coded component navigation lists.

When adding or changing a component, update the registry, its route, its demo, and its MDX navigation entry together. Run `pnpm registry:build` and `pnpm build` to verify the generated registry and docs. Review every component page for a usable example when reorganizing the docs.
## Delivery

This repo publishes a hosted shadcn registry, not an npm package. The installable component artifacts are generated by `pnpm registry:build` into `apps/docs/public/r/*.json`, and the docs app serves them publicly under `https://shad.mp-lb.dev/r/<component>.json`.

Production publishing happens on pushes to `main` through `.github/workflows/deploy-arc.yaml`. It validates the project and ArcNet configuration, then runs `pnpm exec arcnet deploy` for the Vercel site selected in `.arcnet/arcnet.yaml`. The site uses `vercel.json`:

- install: `pnpm install --frozen-lockfile`
- build: `pnpm build`
- output: `apps/docs/.next`

After pushing, check the matching “Deploy ArcNet static sites” GitHub Actions run and its `arcnet-production` deployment status. Wait for success, then spot-check the registry URL for the changed component, for example:

```sh
curl -I -L https://shad.mp-lb.dev/r/message-input.json
```

There is also a CodeQL GitHub Action on pushes, but it is analysis only; it is not the publishing mechanism.

<!-- Project types -->
## Frontend

Use the UI framework and component library configured in the frontend package. For shadcn/ui frontends, add components from that package's directory with the shadcn CLI and reuse the existing utilities, preset and theme. Do not assume the frontend is named `apps/frontend`.

Keep components focused, reuse form schemas and existing loading/error patterns, and validate the affected frontend through its configured Zap tasks.

This repository maintains a component registry. Preserve the actual registry files and consumer docs/playground structure; do not assume `apps/frontend` exists.

<!-- Extensions -->
## ArcNet

This project uses ArcNet. `.arcnet/arcnet.yaml` records its configured sources, consumers and selected deployment services. Read that configuration and the delivery block before changing infrastructure. Minimal installations may only manage secrets/variables; do not assume an application is deployed.

Keep deployment build paths, runtime entrypoints, health settings and domains aligned with the actual applications. Local databases are not automatically deployment services. Verify the relevant workflow and runtime result after delivery.

Setup and updates: `fm read extensions/arcnet/README.md --store mp-lb/fssstack` and `fm read SETUP.md --store mp-lb/arcnet`.

This is a full installation deploying the `docs` Vercel site at `shad.mp-lb.dev`. Its GitHub environment is `arcnet-production`; the `deploy` secret consumer supplies the configured Vercel and Cloudflare credentials.
## ArcNet secrets and variables

Read `.arcnet/arcnet.yaml` for the actual Forum sources and configured consumers. Source values live in those stores; encrypted snapshots under `.arcnet/secrets/` are committed. GitHub repository secrets contain CI decryption keys, not the plaintext source values.

After changing sources, run `arcnet secrets sync` or `arcnet variables sync` as appropriate and commit refreshed snapshots. Use `arcnet env check --password` for local validation and `arcnet env run --consumer <name> -- <command>` for a configured consumer. Keep plaintext, passwords and decryption keys out of context and Git.

These delivery sources are distinct from local `.env` secrets and `.env.local` non-secret defaults where the project uses those files.
## Domains

Use the project's deployment configuration and runbook for its actual canonical hostnames and authoritative DNS/provider ownership. For ArcNet, service domains live in `.arcnet/arcnet.yaml`; do not assume historical Terraform files control the current deployment.

A domain change must account for application URLs, CORS, auth callbacks, redirects and external integrations. Verify provider mappings, DNS, TLS and application health before retiring a working hostname. Use provider-reported DNS targets, not copied account-specific values.

Setup and updates: `fm read extensions/custom-domains/README.md --store mp-lb/fssstack`.

The canonical registry/docs hostname is `shad.mp-lb.dev`, declared under the `docs` Vercel site in `.arcnet/arcnet.yaml`. ArcNet’s deployment consumer uses the configured Vercel and Cloudflare credentials. Preserve registry URLs under `/r/` when changing domain or hosting configuration.

<!-- MapLab augmentations -->
## MapLab workflow

Commit completed changes promptly, then use follow-up commits for fixes. Commit only your own changes; unrelated edits are normal and do not block work. Follow explicit project/user push preferences, and establish the preference once if unknown. Do not assume a push is harmless: it may trigger delivery.

Use Berth for project work and tasks; use `berth project list` and built-in help to locate the relevant project. Keep locally developed CLI tools built and linked after changing them. Run environment-dependent work through the project's Zap tasks.
## MapLab toolchain

Every project using the MapLab augmentation uses mise for local tool selection. Read Node from `.node-version`. For pnpm projects, read pnpm from `package.json#packageManager`; do not duplicate these pins in `mise.toml`. npm projects keep npm and use the version bundled with the selected Node unless they explicitly pin another version. Preserve existing project versions and package managers.

Run `mise trust` and `mise install` when setting up a checkout. Use an activated shell or `mise exec -- zap ...` so tasks inherit the selected tools. Zapper remains the task/process runner. Verify the resolved Node and package-manager versions against their canonical sources.

Prefer installed tools' built-in help and verify authentication when needed; do not assume every cloud service is authenticated. Keep local CLI commands linked to the intended local build through a version-independent PATH directory, so changing the selected Node version does not hide `zap` or `fm`.
