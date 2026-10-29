import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { PageHeader } from "@/components/page-header";
import { FullScreenStateDemo } from "@/components/full-screen-state-demo";

export default function FullScreenStatePage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Full Screen State"
          description="A flexible layout for a full-screen state."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/full-screen-state.json"
        />
        <FullScreenStateDemo />
      </div>
    </DocsPage>
  );
}
