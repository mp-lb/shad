import { useMemo, useState } from "react"
import { ArrowRight, Braces, FileText, ListTree, Terminal } from "lucide-react"

import { MdKitLocalEditor } from "../../../registry/mdkit-editor/mdkit-editor"
import { JsonViewer } from "../../../registry/json-viewer/json-viewer"
import { StructuredLogViewer } from "../../../registry/structured-log-viewer/structured-log-viewer"

const installBase = "pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r"

const sampleMarkdown = `# Release notes

Ship the editor shell as app-local shadcn source.

- Editable markdown surface from \`@mp-lb/mdkit\`
- shadcn toolbar and dialogs from \`@mp-lb/shad\`
- Source installed into the consuming app
`

const samplePayload = {
  documentId: "docs/release-notes.md",
  status: "saved",
  version: 42,
  updatedAt: "2026-05-21T13:35:00.000Z",
  author: {
    id: "usr_123",
    name: "Felix",
  },
  features: ["markdown", "version-history", "conflict-resolution"],
  transport: {
    type: "trpc",
    endpoint: "/trpc",
  },
}

const sampleEvents = [
  {
    _id: "evt_001",
    timestamp: "2026-05-21T13:30:00.000Z",
    level: "info",
    eventType: "mdkit.document.loaded",
    message: "Loaded markdown document.",
    details: {
      documentId: "docs/release-notes.md",
      version: 41,
    },
    trace: { traceId: "trc_7fd932" },
  },
  {
    _id: "evt_002",
    timestamp: "2026-05-21T13:31:15.000Z",
    level: "warn",
    eventType: "mdkit.save.pending",
    message: "Autosave is waiting for debounce.",
    details: {
      documentId: "docs/release-notes.md",
      debounceMs: 1000,
    },
    trace: { traceId: "trc_7fd932" },
  },
  {
    _id: "evt_003",
    timestamp: "2026-05-21T13:31:16.000Z",
    level: "info",
    eventType: "mdkit.save.completed",
    message: "Document saved successfully.",
    details: {
      documentId: "docs/release-notes.md",
      version: 42,
      statusCode: 200,
    },
    trace: { traceId: "trc_7fd932" },
  },
]

const components = [
  {
    id: "mdkit-editor",
    title: "MDKit Editor",
    description: "A shadcn-rendered markdown editor shell powered by @mp-lb/mdkit.",
    href: "/r/mdkit-editor.json",
    icon: FileText,
  },
  {
    id: "json-viewer",
    title: "JSON Viewer",
    description: "Collapsible JSON tree with search, path copying, and themes.",
    href: "/r/json-viewer.json",
    icon: Braces,
  },
  {
    id: "structured-log-viewer",
    title: "Structured Log Viewer",
    description: "Expandable event logs with dot-path headline fields and raw JSON.",
    href: "/r/structured-log-viewer.json",
    icon: Terminal,
  },
]

function CodeLine({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-md border bg-muted/35 px-3 py-2 font-mono text-xs text-muted-foreground">
      <code>{children}</code>
    </pre>
  )
}

function SectionHeader({
  description,
  install,
  title,
}: {
  description: string
  install: string
  title: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <CodeLine>{install}</CodeLine>
    </div>
  )
}

function App() {
  const [markdown, setMarkdown] = useState(sampleMarkdown)

  const logFields = useMemo(
    () => [
      { label: "doc", path: "details.documentId" },
      { label: "version", path: "details.version" },
      { label: "trace", path: "trace.traceId" },
    ],
    []
  )

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ListTree className="size-4" />
              shadcn registry
            </div>
            <div className="max-w-3xl">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                @mp-lb/shad
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                Install app-local shadcn source for MP-LB components, then edit
                it like normal project code.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {components.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="group rounded-lg border bg-background p-4 transition-colors hover:bg-muted/35"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Icon className="size-5 text-muted-foreground" />
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <h2 className="mt-4 text-sm font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </a>
              )
            })}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8">
        <section id="mdkit-editor" className="flex scroll-mt-8 flex-col gap-5">
          <SectionHeader
            title="MDKit Editor"
            description="A live local markdown editor using the same registry source installed by shadcn."
            install={`${installBase}/mdkit-editor.json`}
          />
          <div className="rounded-lg border bg-card p-3">
            <MdKitLocalEditor
              title="Release notes"
              value={markdown}
              onChange={setMarkdown}
            />
          </div>
        </section>

        <section id="json-viewer" className="flex scroll-mt-8 flex-col gap-5">
          <SectionHeader
            title="JSON Viewer"
            description="Browse structured payloads with collapsible nodes, search, and path copying."
            install={`${installBase}/json-viewer.json`}
          />
          <JsonViewer
            data={samplePayload}
            title="Document payload"
            rootName="payload"
            defaultExpanded={2}
          />
        </section>

        <section
          id="structured-log-viewer"
          className="flex scroll-mt-8 flex-col gap-5"
        >
          <SectionHeader
            title="Structured Log Viewer"
            description="Show compact event headlines, expand rows, and inspect the full raw JSON payload."
            install={`${installBase}/structured-log-viewer.json`}
          />
          <StructuredLogViewer
            title="MDKit events"
            events={sampleEvents}
            fields={logFields}
            levelPath="level"
            messagePath="message"
            statusPath="details.statusCode"
            timestampPath="timestamp"
            titlePath="eventType"
          />
        </section>
      </div>
    </main>
  )
}

export default App
