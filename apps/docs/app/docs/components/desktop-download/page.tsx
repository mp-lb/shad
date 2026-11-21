import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { DesktopDownloadDemo } from "@/components/desktop-download-demo";
import { PageHeader } from "@/components/page-header";

export default function DesktopDownloadPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Desktop Download"
          description="Recommend a desktop installer and offer every available package in a dropdown."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/desktop-download.json"
        />
        <DesktopDownloadDemo />
      </div>
    </DocsPage>
  );
}
