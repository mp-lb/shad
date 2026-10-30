import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { PageHeader } from "@/components/page-header";
import { FullScreenCodeEntryDemo } from "@/components/full-screen-code-entry-demo";

export default function FullScreenCodeEntryPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader title="Full-screen code entry" description="Confirm a CLI login with a prefilled code or enter one manually." install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/full-screen-code-entry.json" />
        <FullScreenCodeEntryDemo />
        <p className="text-sm text-muted-foreground">Pass the URL’s public user code into the controlled <code>code</code> prop after removing spaces and hyphens. Prefilling never submits: the user must click Approve. Use <code>pending</code> and <code>error</code> for request feedback. Your application handles authentication and server-side verification in <code>onConfirm</code>.</p>
      </div>
    </DocsPage>
  );
}
