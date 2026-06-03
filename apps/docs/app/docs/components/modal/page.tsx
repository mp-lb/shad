import { DocsPage } from "fumadocs-ui/layouts/docs/page";

import { ModalDemo } from "@/components/modal-demo";
import { PageHeader } from "@/components/page-header";

export default function ModalPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Modal"
          description="Alert, standard, and fullscreen modal shells with fixed headers, fixed footers, and scrollable bodies."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/modal.json"
        />
        <ModalDemo />
      </div>
    </DocsPage>
  );
}
