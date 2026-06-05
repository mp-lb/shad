import { DocsPage } from "fumadocs-ui/layouts/docs/page";

import { MessageInputDemo } from "@/components/message-input-demo";
import { PageHeader } from "@/components/page-header";

export default function MessageInputPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Message Input"
          description="AI chat composer with entity mentions, optional slash commands, async suggestions, and submit metadata."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/message-input.json"
        />
        <MessageInputDemo />
      </div>
    </DocsPage>
  );
}
