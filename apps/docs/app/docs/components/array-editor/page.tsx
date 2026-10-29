import { DocsPage } from "fumadocs-ui/layouts/docs/page";

import { ArrayEditorDemo } from "@/components/array-editor-demo";
import { PageHeader } from "@/components/page-header";

export default function ArrayEditorPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="List Editor"
          description="A sortable list with customizable row content and inline create and edit forms. ArrayEditor remains available for existing consumers."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/list-editor.json"
        />
        <ArrayEditorDemo />
        <div className="space-y-3 text-sm">
          <p><code>ListEditor</code> accepts <code>renderItem</code> for custom row content and <code>renderEditor</code> for the expanded edit form. Control the expanded row with <code>editingId</code> and <code>onEdit</code>.</p>
          <p>Use <code>onStartCreate</code>, <code>creating</code>, and <code>renderCreate</code> to put a custom create form in the final row. <code>onMove</code> receives the source and destination indices. Existing <code>ArrayEditor</code> imports and simple label-based creation remain supported.</p>
        </div>
      </div>
    </DocsPage>
  );
}
