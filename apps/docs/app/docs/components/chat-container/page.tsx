import { DocsPage } from "fumadocs-ui/layouts/docs/page";

import { PageHeader } from "@/components/page-header";

export default function ChatContainerPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <PageHeader
        title="Chat Container"
        description="A scrollable chat viewport with follow and jump-to-latest behavior."
        install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/chat-container.json"
      />
    </DocsPage>
  );
}
