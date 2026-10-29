import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { PageHeader } from "@/components/page-header";
import { DesktopStatesDemo } from "@/components/desktop-states-demo";

export default function DesktopStatesPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Desktop States"
          description="Optional sign-in, browser handoff, offline and error screens for desktop apps."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/desktop-states.json"
        />
        <DesktopStatesDemo />
        <p className="text-sm text-muted-foreground">
          These components supply presentation only. To show the offline state
          before a hosted frontend loads, bundle the component and its assets
          locally in the desktop app.
        </p>
      </div>
    </DocsPage>
  );
}
