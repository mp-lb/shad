## Documentation

Keep Shad-specific documentation under `docs/`. Public component documentation is part of this project; shared standards and extensions stay in Forum.

This project has no dedicated Forum store or `.forum/` sync configuration. Read shared standards with `fm read <file>.md --store mp-lb/dev` (list them with `fm ls --store mp-lb/dev`). Read shared extensions with `fm read extensions/<file>.md --store mp-lb/fssstack` (list them with `fm ls extensions --store mp-lb/fssstack`).


### Component documentation

The public site uses Next.js routes under `apps/docs/app/docs/components/` for the rendered component pages. Each registry component must have a page with its install command and a working, representative rendered example; use a client demo when the component is interactive. The source lives under `registry/` and `registry.json` defines the installable files and dependencies. The matching MDX entry under `apps/docs/content/docs/components/` supplies the docs navigation metadata; add it to `meta.json`. The docs sidebar is one flat list derived from that metadata, and `/docs` opens its first component. Avoid separate hard-coded component navigation lists.

When adding or changing a component, update the registry, its route, its demo, and its MDX navigation entry together. Run `pnpm registry:build` and `pnpm build` to verify the generated registry and docs. Review every component page for a usable example when reorganizing the docs.
