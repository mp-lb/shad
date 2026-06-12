import { DocsPage } from "fumadocs-ui/layouts/docs/page";

import { AvatarStackDemo } from "@/components/avatar-stack-demo";
import { PageHeader } from "@/components/page-header";

export default function AvatarStackPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Avatar Stack"
          description="Overlapping avatar row with size presets, CSS-variable sizing, an overflow count, and bring-your-own circle content."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/avatar-stack.json"
        />
        <AvatarStackDemo />
      </div>
    </DocsPage>
  );
}
