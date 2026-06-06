import { DocsPage } from "fumadocs-ui/layouts/docs/page";

import {
  MessageInputDemo,
  messageInputDemoCode,
} from "@/components/message-input-demo";
import { CodeBlock, CodeLine } from "@/components/code-line";
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
        <div className="grid gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Demo code</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This example also uses standard shadcn primitives for the toolbar
              and attachment menu.
            </p>
          </div>
          <CodeLine>pnpm dlx shadcn@latest add button dropdown-menu</CodeLine>
          <CodeBlock title="message-input-demo.tsx">
            {messageInputDemoCode}
          </CodeBlock>
        </div>
      </div>
    </DocsPage>
  );
}
