import { DocsPage } from "fumadocs-ui/layouts/docs/page";

import { MessageBubbleDemo } from "@/components/message-bubble-demo";
import { PageHeader } from "@/components/page-header";

export default function MessageBubblePage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <PageHeader
        title="Message Bubble"
        description="Incoming and outgoing chat rows with a pluggable shadcn Avatar slot."
        install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/message-bubble.json"
      />
      <div className="mt-6">
        <MessageBubbleDemo />
      </div>
    </DocsPage>
  );
}
