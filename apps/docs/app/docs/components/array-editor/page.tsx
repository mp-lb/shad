import { DocsPage } from "fumadocs-ui/layouts/docs/page";

import { ArrayEditorDemo } from "@/components/array-editor-demo";
import { PageHeader } from "@/components/page-header";

export default function ArrayEditorPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Array Editor"
          description="Reorder lists and opt into label creation, renaming, deletion, and edit callbacks."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/array-editor.json"
        />
        <ArrayEditorDemo />
      </div>
    </DocsPage>
  );
}
