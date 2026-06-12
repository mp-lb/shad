import * as React from "react"
import {
  Bot,
  CheckCircle2,
  Columns3,
  Database,
  FileText,
  FolderOpen,
  Gauge,
  Globe2,
  Image,
  Moon,
  PanelLeft,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
  Wand2,
} from "lucide-react"

import {
  ArrayEditor,
  type ArrayEditorObjectItem,
} from "@/components/array-editor"
import { AvatarStack, AvatarStackItem } from "@/components/avatar-stack"
import {
  DebuggerDock,
  DebuggerMetrics,
  DebuggerNotice,
  DebuggerTable,
  DebuggerViewport,
  type DebuggerColumn,
  type DebuggerDockSide,
  type DebuggerDockSize,
} from "@/components/debugger"
import { JsonViewer } from "@/components/json-viewer"
import {
  DockedDebugger,
  FloatingInspector,
  InspectorList,
  InspectorMetricGrid,
  InspectorSection,
  InspectorTabs,
} from "@/components/inspector"
import { MdKitLocalEditor } from "@/components/mdkit-editor"
import {
  MessageInput,
  type MessageInputCommand,
  type MessageInputEntity,
  type MessageInputSubmitPayload,
} from "@/components/message-input"
import { AlertModal, FullscreenModal, StandardModal } from "@/components/modal"
import { StructuredLogViewer } from "@/components/structured-log-viewer"
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RetryErrorState,
  SuccessState,
} from "@/components/ui-states/ui-states"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type ComponentId =
  | "message-input"
  | "json-viewer"
  | "array-editor"
  | "structured-log-viewer"
  | "modal"
  | "avatar-stack"
  | "ui-states"
  | "mdkit-editor"
  | "inspector"
  | "debugger"

type WidthMode = "fluid" | "narrow" | "wide"
type ThemeMode = "light" | "dark"

type Scenario = {
  id: string
  title: string
  description: string
  render: () => React.ReactNode
}

type ComponentGroup = {
  id: ComponentId
  title: string
  description: string
  scenarios: Scenario[]
}

const componentOrder: ComponentId[] = [
  "message-input",
  "json-viewer",
  "array-editor",
  "structured-log-viewer",
  "modal",
  "avatar-stack",
  "ui-states",
  "mdkit-editor",
  "debugger",
  "inspector",
]

const complexPayload = {
  id: "doc_9xQ24",
  status: "saved",
  revision: 42,
  updatedAt: "2026-06-05T09:24:00.000Z",
  owner: {
    id: "usr_felix",
    name: "Felix",
    roles: ["admin", "editor"],
  },
  document: {
    title: "Registry QA checklist",
    tags: ["registry", "shadcn", "playground"],
    metrics: {
      comments: 18,
      unresolvedThreads: 2,
      renderMs: 34.82,
    },
  },
  flags: {
    autosave: true,
    conflict: false,
    readonly: false,
  },
  nullish: null,
}

const largePayload = {
  events: Array.from({ length: 18 }, (_, index) => ({
    id: `evt_${String(index + 1).padStart(2, "0")}`,
    level: index % 5 === 0 ? "warn" : index % 7 === 0 ? "error" : "info",
    message: `Processed registry fixture ${index + 1}`,
    durationMs: 18 + index * 7,
    nested: {
      attempt: index + 1,
      cache: index % 3 === 0 ? "miss" : "hit",
      paths: ["components", "registry", `case-${index + 1}`],
    },
  })),
}

const initialArrayItems: ArrayEditorObjectItem[] = [
  { id: "schema", label: "Schema review", description: "Targets and deps" },
  { id: "install", label: "Install flow", description: "shadcn add output" },
  { id: "visual", label: "Visual pass", description: "Light and dark mode" },
  { id: "stress", label: "Stress data", description: "Long lists and labels" },
]

const messageEntities: MessageInputEntity[] = [
  {
    id: "ada",
    label: "Ada Lovelace",
    type: "user",
    description: "Product engineering",
  },
  {
    id: "grace",
    label: "Grace Hopper",
    type: "user",
    description: "Compiler systems",
  },
  {
    id: "orb",
    label: "Orb Assistant",
    type: "assistant",
    description: "AI project helper",
    icon: Bot,
  },
  {
    id: "brief",
    label: "Launch Brief",
    type: "document",
    description: "Shared planning document",
    icon: FileText,
  },
]

const messageCommands: MessageInputCommand[] = [
  {
    id: "summarize",
    label: "Summarize",
    description: "Condense the current context.",
    icon: Sparkles,
  },
  {
    id: "rewrite",
    label: "Rewrite",
    description: "Improve tone and clarity.",
    icon: Wand2,
  },
]

const logEvents = Array.from({ length: 24 }, (_, index) => {
  const status = index % 9 === 0 ? 500 : index % 5 === 0 ? 404 : 200

  return {
    _id: `log_${index + 1}`,
    timestamp: new Date(Date.UTC(2026, 5, 5, 9, index * 3)).toISOString(),
    level: status >= 500 ? "error" : status >= 400 ? "warn" : "info",
    eventType: index % 2 === 0 ? "registry.install" : "component.render",
    message:
      status >= 500
        ? "Registry item failed to resolve"
        : status >= 400
          ? "Optional dependency skipped"
          : "Scenario rendered",
    request: {
      component: componentOrder[index % componentOrder.length],
      status,
      durationMs: 20 + index * 11,
    },
  }
})

const inspectorTabs = [
  { id: "state", label: "state", count: 4 },
  { id: "events", label: "events", count: 12 },
  { id: "network", label: "network", count: 3 },
]

const inspectorItems = [
  {
    id: "route",
    label: "route.changed",
    meta: "/stores/felixsebastian/fssstack",
    tone: "info" as const,
    value: "31ms",
  },
  {
    id: "sync",
    label: "sync.clean",
    meta: "manifest matched remote bytes",
    tone: "success" as const,
    value: "ok",
  },
  {
    id: "cache",
    label: "cache.stale",
    meta: "revalidated ambient query",
    tone: "warning" as const,
    value: "1.8s",
  },
  {
    id: "write",
    label: "write.blocked",
    meta: "localhost inspector only",
    tone: "danger" as const,
    value: "dev",
  },
]

type DebuggerChunkRow = {
  capturedAt: string
  contentType: string
  sequence: number
  sizeBytes: number
  status: "pending" | "uploaded"
  streamId: string
  uploadedAt?: string
}

const debuggerRows: DebuggerChunkRow[] = [
  {
    capturedAt: "09:14:22",
    contentType: "audio/webm",
    sequence: 1,
    sizeBytes: 24832,
    status: "uploaded",
    streamId: "str_alpha",
    uploadedAt: "09:14:31",
  },
  {
    capturedAt: "09:14:25",
    contentType: "audio/webm",
    sequence: 2,
    sizeBytes: 21918,
    status: "uploaded",
    streamId: "str_alpha",
    uploadedAt: "09:14:34",
  },
  {
    capturedAt: "09:16:08",
    contentType: "audio/webm",
    sequence: 1,
    sizeBytes: 18642,
    status: "pending",
    streamId: "str_beta",
  },
]

const debuggerColumns: DebuggerColumn<DebuggerChunkRow>[] = [
  { header: "Stream", render: (row) => row.streamId },
  { header: "Seq", className: "w-14", render: (row) => row.sequence },
  { header: "Status", render: (row) => row.status },
  { header: "Size", render: (row) => row.sizeBytes },
  { header: "Type", render: (row) => row.contentType },
  { header: "Captured", render: (row) => row.capturedAt },
  { header: "Uploaded", render: (row) => row.uploadedAt ?? "-" },
]

const markdownSeed = `# Playground notes

Use this space to push the editor a little harder than the docs demo.

- Try a short note.
- Add a longer paragraph and resize the viewport.
- Toggle dark mode with the controls above or the \`d\` key.

\`\`\`ts
const source = "installed from the local registry build"
\`\`\`
`

function move<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items]
  const [item] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, item)
  return next
}

function MessageInputScenario({ commands = true }: { commands?: boolean }) {
  const [payload, setPayload] =
    React.useState<MessageInputSubmitPayload | null>(null)
  const [webSearchEnabled, setWebSearchEnabled] = React.useState(false)
  const previewPayload = payload
    ? { ...payload, webSearch: webSearchEnabled }
    : {
        text: "",
        entities: [],
        command: null,
        webSearch: webSearchEnabled,
      }

  return (
    <div className="flex min-h-[560px] flex-col justify-end gap-4">
      <MessageInput
        className="rounded-lg border shadow-sm"
        placeholder={
          commands
            ? "Ask Orb to summarize @Ada or use /rewrite..."
            : "Tag a person, bot, or document with @..."
        }
        entities={messageEntities}
        commands={commands ? messageCommands : []}
        attachmentControl={<MessageAttachmentMenu />}
        enableSpeechInput
        leadingActions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setWebSearchEnabled((current) => !current)}
            aria-pressed={webSearchEnabled}
            className={cn(
              "h-8 rounded-full",
              webSearchEnabled &&
                "bg-blue-500/10 text-blue-700 hover:bg-blue-500/15 hover:text-blue-700 dark:bg-blue-400/15 dark:text-blue-300 dark:hover:bg-blue-400/20 dark:hover:text-blue-300",
              !webSearchEnabled && "text-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Globe2 className="size-4" />
            Web search
          </Button>
        }
        onSearchEntities={(query) =>
          new Promise((resolve) => {
            window.setTimeout(() => {
              const normalizedQuery = query.toLowerCase()
              resolve(
                messageEntities.filter((entity) =>
                  [entity.label, entity.type, entity.description]
                    .filter(Boolean)
                    .some((value) =>
                      value!.toLowerCase().includes(normalizedQuery)
                    )
                )
              )
            }, 180)
          })
        }
        onSubmit={setPayload}
      />
      <div className="rounded-md border bg-muted/30 p-3">
        <div className="text-xs font-medium uppercase text-muted-foreground">
          Submit payload
        </div>
        <pre className="mt-2 overflow-auto text-xs">
          {JSON.stringify(previewPayload, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function MessageAttachmentMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-foreground hover:bg-muted hover:text-foreground"
          aria-label="Attach"
        >
          <Plus className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-max min-w-40">
        <DropdownMenuItem>
          <FileText className="size-4" />
          Document
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Image className="size-4" />
          Image
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FolderOpen className="size-4" />
          Workspace file
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ArrayEditorScenario({
  disabled = false,
  empty = false,
}: {
  disabled?: boolean
  empty?: boolean
}) {
  const [items, setItems] = React.useState<ArrayEditorObjectItem[]>(
    empty ? [] : initialArrayItems
  )
  const [lastEdit, setLastEdit] = React.useState<string | null>(null)

  return (
    <div className="grid gap-3">
      <ArrayEditor
        items={items}
        createDisabled={disabled}
        deleteDisabled={disabled}
        editDisabled={disabled}
        renameDisabled={disabled}
        emptyLabel="No checklist items yet"
        minItems={disabled ? 2 : 0}
        onCreate={(label) =>
          setItems((current) => [
            ...current,
            { id: crypto.randomUUID(), label },
          ])
        }
        onDelete={(itemId) =>
          setItems((current) => current.filter((item) => item.id !== itemId))
        }
        onEdit={(itemId) => setLastEdit(itemId)}
        onMove={(fromIndex, toIndex) =>
          setItems((current) => move(current, fromIndex, toIndex))
        }
        onRename={(itemId, label) =>
          setItems((current) =>
            current.map((item) =>
              item.id === itemId ? { ...item, label } : item
            )
          )
        }
      />
      {lastEdit ? (
        <p className="text-sm text-muted-foreground">
          Last edit callback:{" "}
          {items.find((item) => item.id === lastEdit)?.label ?? lastEdit}
        </p>
      ) : null}
    </div>
  )
}

function ModalScenario({ mode }: { mode: "standard" | "fullscreen" | "alert" }) {
  const [open, setOpen] = React.useState(false)
  const body = (
    <div className="grid gap-3 text-sm leading-6 text-muted-foreground">
      {Array.from({ length: mode === "fullscreen" ? 16 : 7 }, (_, index) => (
        <p key={index}>
          Section {index + 1}: this content exists to test scroll behavior,
          footer pinning, close controls, and responsive dialog sizing.
        </p>
      ))}
    </div>
  )

  return (
    <div className="grid gap-4">
      <Button onClick={() => setOpen(true)}>Open {mode} modal</Button>
      {mode === "standard" ? (
        <StandardModal
          open={open}
          onOpenChange={setOpen}
          title="Standard modal"
          description="Scrollable body with fixed header and footer."
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save changes</Button>
            </>
          }
        >
          {body}
        </StandardModal>
      ) : null}
      {mode === "fullscreen" ? (
        <FullscreenModal
          open={open}
          onOpenChange={setOpen}
          title="Fullscreen modal"
          description="A high-density workflow surface."
          footer={<Button onClick={() => setOpen(false)}>Done</Button>}
        >
          {body}
        </FullscreenModal>
      ) : null}
      {mode === "alert" ? (
        <AlertModal
          open={open}
          onOpenChange={setOpen}
          title="Archive scenario?"
          description="Alert copy should stay readable at narrow widths."
          actionLabel="Archive"
          actionVariant="destructive"
          cancelLabel="Cancel"
        >
          This checks destructive action spacing and footer stacking.
        </AlertModal>
      ) : null}
    </div>
  )
}

const stackPeople = [
  "Ada Lovelace",
  "Grace Hopper",
  "Alan Turing",
  "Katherine Johnson",
  "Edsger Dijkstra",
  "Barbara Liskov",
  "Donald Knuth",
]

function getStackInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function getStackColorStyle(value: string) {
  const hash = [...value].reduce(
    (currentHash, character) =>
      character.charCodeAt(0) + ((currentHash << 5) - currentHash),
    0
  )

  return { backgroundColor: `hsl(${Math.abs(hash) % 360} 58% 42%)` }
}

function StackInitialsItem({ name }: { name: string }) {
  return (
    <AvatarStackItem
      aria-label={name}
      className="font-semibold text-white"
      style={getStackColorStyle(name)}
    >
      {getStackInitials(name)}
    </AvatarStackItem>
  )
}

function AvatarStackScenario({ mode }: { mode: "presets" | "overflow" }) {
  if (mode === "overflow") {
    return (
      <div className="flex flex-wrap items-center gap-6">
        {[3, 4, 5].map((max) => (
          <AvatarStack key={max} max={max} size="md">
            {stackPeople.map((name) => (
              <StackInitialsItem key={name} name={name} />
            ))}
          </AvatarStack>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-6">
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <AvatarStack key={size} size={size}>
            {stackPeople.slice(0, 3).map((name) => (
              <StackInitialsItem key={name} name={name} />
            ))}
          </AvatarStack>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-6">
        {(["none", "sm", "md", "lg"] as const).map((overlap) => (
          <AvatarStack key={overlap} overlap={overlap} size="md">
            {stackPeople.slice(0, 3).map((name) => (
              <StackInitialsItem key={name} name={name} />
            ))}
          </AvatarStack>
        ))}
      </div>
      <AvatarStack className="[--avatar-stack-overlap:0.875rem] [--avatar-stack-size:3.5rem] text-lg">
        {stackPeople.slice(0, 4).map((name) => (
          <StackInitialsItem key={name} name={name} />
        ))}
      </AvatarStack>
    </div>
  )
}

function UiStatesScenario({ mode }: { mode: "all" | "inline" | "loading" }) {
  if (mode === "loading") {
    return <LoadingState label="Loading registry scenario" size="lg" />
  }

  if (mode === "inline") {
    return (
      <div className="grid gap-3">
        <ErrorState
          presentation="inline"
          title="Install failed"
          description="The registry target path did not resolve."
        />
        <SuccessState
          presentation="inline"
          title="Install succeeded"
          description="All generated component files landed under src/components."
        />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <EmptyState
        title="No scenarios selected"
        description="Pick a component and scenario to start exercising it."
      />
      <RetryErrorState
        title="Could not render case"
        description="Retry keeps the button layout honest."
        onRetry={() => undefined}
      />
      <SuccessState
        title="Registry build passed"
        description="Generated JSON is available for local install."
      />
      <LoadingState label="Syncing preview" />
    </div>
  )
}

function MdKitScenario({ fillHeight }: { fillHeight: boolean }) {
  const [value, setValue] = React.useState(markdownSeed)

  return (
    <MdKitLocalEditor
      title={fillHeight ? "Fill-height editor" : "Local markdown editor"}
      value={value}
      onChange={setValue}
      fillHeight={fillHeight}
      className={fillHeight ? "h-[560px]" : undefined}
      editorClassName={fillHeight ? "min-h-0" : "min-h-80"}
    />
  )
}

function InspectorContent() {
  const [activeTab, setActiveTab] = React.useState("state")

  return (
    <div className="grid gap-2">
      <InspectorTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={inspectorTabs}
      />
      <InspectorMetricGrid
        metrics={[
          { label: "stores", value: 9 },
          { label: "files", value: 128 },
          { label: "dirty", value: 0 },
          { label: "latency", value: "44ms" },
        ]}
      />
      <InspectorSection title={activeTab}>
        <InspectorList items={inspectorItems} />
      </InspectorSection>
    </div>
  )
}

function InspectorScenario({ mode }: { mode: "floating" | "debugger" | "both" }) {
  const [floatingOpen, setFloatingOpen] = React.useState(true)
  const [debuggerOpen, setDebuggerOpen] = React.useState(true)
  const showFloating = mode === "floating" || mode === "both"
  const showDebugger = mode === "debugger" || mode === "both"

  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-md border bg-muted/20">
      <div className="grid gap-2 p-4 font-mono text-xs text-muted-foreground">
        <div className="flex items-center gap-2 text-foreground">
          <Gauge className="size-4" />
          Localhost development surface
        </div>
        <div>Use the icon controls to move, resize, dock, and minimize.</div>
        <div>Display state is written to localStorage per storage key.</div>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {showFloating && !floatingOpen ? (
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={() => setFloatingOpen(true)}
            >
              Open floating
            </Button>
          ) : null}
          {showDebugger && !debuggerOpen ? (
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={() => setDebuggerOpen(true)}
            >
              Open debugger
            </Button>
          ) : null}
        </div>
      </div>
      {showFloating ? (
        <FloatingInspector
          title="Doctrine inspector"
          storageKey="mp-lb-playground-floating-inspector"
          open={floatingOpen}
          onOpenChange={setFloatingOpen}
        >
          <InspectorContent />
        </FloatingInspector>
      ) : null}
      {showDebugger ? (
        <DockedDebugger
          title="Debugger"
          storageKey="mp-lb-playground-docked-debugger"
          open={debuggerOpen}
          onOpenChange={setDebuggerOpen}
          closeDisabled={mode === "both"}
        >
          <InspectorContent />
        </DockedDebugger>
      ) : null}
    </div>
  )
}

function DebuggerScenario() {
  const [activeTab, setActiveTab] = React.useState("chunks")
  const [error, setError] = React.useState<React.ReactNode>(null)
  const [open, setOpen] = React.useState(true)
  const [side, setSide] = React.useState<DebuggerDockSide>("bottom")
  const [size, setSize] = React.useState<DebuggerDockSize>("compact")

  return (
    <DebuggerViewport
      className="h-[560px] rounded-md border bg-muted/20"
      debuggerOpen={open}
      side={side}
      debugger={
        <DebuggerDock
          title="Runtime debugger"
          activeTab={activeTab}
          onTabChange={setActiveTab}
          open={open}
          onOpenChange={setOpen}
          side={side}
          onSideChange={setSide}
          size={size}
          onSizeChange={setSize}
          tabs={[
            { id: "chunks", label: "Chunks", count: debuggerRows.length },
            { id: "events", label: "Events", count: 8 },
          ]}
          actions={[
            {
              id: "refresh",
              icon: RotateCcw,
              label: "Refresh",
              onClick: () => setError(null),
            },
            {
              id: "clear",
              icon: Database,
              label: "Clear",
              tone: "danger",
              onClick: () =>
                setError("Clear action is disabled in the playground."),
            },
          ]}
        >
          <DebuggerMetrics
            metrics={[
              { label: "Streams", value: 2 },
              { label: "Chunks", value: debuggerRows.length },
              { label: "Pending", value: 1 },
              { label: "Bytes", value: 65392 },
            ]}
          />
          {error ? <DebuggerNotice>{error}</DebuggerNotice> : null}
          <DebuggerTable
            rows={debuggerRows}
            columns={debuggerColumns}
            getRowId={(row) => `${row.streamId}:${row.sequence}`}
          />
        </DebuggerDock>
      }
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="grid gap-2 border-b p-4 font-mono text-xs text-muted-foreground">
          <div className="text-foreground">Fake app viewport</div>
          <div>The debugger is in layout, so this scroll area is resized.</div>
          {!open ? (
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={() => setOpen(true)}
            >
              Open debugger
            </Button>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4 text-sm leading-6 text-muted-foreground">
          {Array.from({ length: 28 }, (_, index) => (
            <p key={index}>
              Application content row {index + 1}. The page itself does not
              scroll here; the child scroll area adapts to the debugger dock.
            </p>
          ))}
        </div>
      </div>
    </DebuggerViewport>
  )
}

const components: Record<ComponentId, ComponentGroup> = {
  "message-input": {
    id: "message-input",
    title: "Message Input",
    description: "AI chat composer with mentions and optional commands.",
    scenarios: [
      {
        id: "mentions-commands",
        title: "Mentions and commands",
        description: "Async @ entity search plus / command selection.",
        render: () => <MessageInputScenario />,
      },
      {
        id: "mentions-only",
        title: "Mentions only",
        description: "Entity tagging without slash commands.",
        render: () => <MessageInputScenario commands={false} />,
      },
    ],
  },
  "json-viewer": {
    id: "json-viewer",
    title: "JSON Viewer",
    description: "Collapsible payloads, search, copy, and deep values.",
    scenarios: [
      {
        id: "complex",
        title: "Complex object",
        description: "Nested data, booleans, arrays, and null values.",
        render: () => (
          <JsonViewer
            data={complexPayload}
            title="Document payload"
            rootName="payload"
            defaultExpanded={2}
          />
        ),
      },
      {
        id: "large",
        title: "Large event list",
        description: "A denser payload with many repeated rows.",
        render: () => (
          <JsonViewer
            data={largePayload}
            title="Generated events"
            rootName="fixture"
            defaultExpanded={1}
          />
        ),
      },
    ],
  },
  "array-editor": {
    id: "array-editor",
    title: "Array Editor",
    description: "Create, rename, delete, reorder, and disabled states.",
    scenarios: [
      {
        id: "editable",
        title: "Editable checklist",
        description: "Full callback surface with reorder support.",
        render: () => <ArrayEditorScenario />,
      },
      {
        id: "empty",
        title: "Empty list",
        description: "Create flow from a blank state.",
        render: () => <ArrayEditorScenario empty />,
      },
      {
        id: "disabled",
        title: "Disabled controls",
        description: "Checks locked actions and minimum item handling.",
        render: () => <ArrayEditorScenario disabled />,
      },
    ],
  },
  "structured-log-viewer": {
    id: "structured-log-viewer",
    title: "Structured Logs",
    description: "Searchable log rows with expandable JSON details.",
    scenarios: [
      {
        id: "mixed-statuses",
        title: "Mixed statuses",
        description: "Info, warning, and error rows with custom fields.",
        render: () => (
          <StructuredLogViewer
            title="Registry install logs"
            events={logEvents}
            statusPath="request.status"
            defaultExpanded
            fields={[
              { label: "component", path: "request.component" },
              { label: "status", path: "request.status" },
              { label: "ms", path: "request.durationMs" },
            ]}
          />
        ),
      },
    ],
  },
  modal: {
    id: "modal",
    title: "Modal",
    description: "Standard, fullscreen, and alert dialog shells.",
    scenarios: [
      {
        id: "standard",
        title: "Standard",
        description: "Long body with fixed footer actions.",
        render: () => <ModalScenario mode="standard" />,
      },
      {
        id: "fullscreen",
        title: "Fullscreen",
        description: "Large workflow surface with scrolling content.",
        render: () => <ModalScenario mode="fullscreen" />,
      },
      {
        id: "alert",
        title: "Alert",
        description: "Small destructive confirmation case.",
        render: () => <ModalScenario mode="alert" />,
      },
    ],
  },
  "avatar-stack": {
    id: "avatar-stack",
    title: "Avatar Stack",
    description: "Overlapping avatar circles with presets and overflow count.",
    scenarios: [
      {
        id: "presets",
        title: "Presets",
        description: "Size and overlap presets plus CSS-variable sizing.",
        render: () => <AvatarStackScenario mode="presets" />,
      },
      {
        id: "overflow",
        title: "Overflow count",
        description: "The max prop collapses extra items into a +N circle.",
        render: () => <AvatarStackScenario mode="overflow" />,
      },
    ],
  },
  "ui-states": {
    id: "ui-states",
    title: "UI States",
    description: "Loading, empty, error, retry, and success layouts.",
    scenarios: [
      {
        id: "all",
        title: "State grid",
        description: "All major states together.",
        render: () => <UiStatesScenario mode="all" />,
      },
      {
        id: "inline",
        title: "Inline states",
        description: "Compact alert-like presentation.",
        render: () => <UiStatesScenario mode="inline" />,
      },
      {
        id: "loading",
        title: "Loader",
        description: "MAP Lab dotmatrix loader at large size.",
        render: () => <UiStatesScenario mode="loading" />,
      },
    ],
  },
  "mdkit-editor": {
    id: "mdkit-editor",
    title: "MDKit Editor",
    description: "Local markdown editing shell using the installed component.",
    scenarios: [
      {
        id: "local",
        title: "Local editor",
        description: "Editable markdown with normal height.",
        render: () => <MdKitScenario fillHeight={false} />,
      },
      {
        id: "fill-height",
        title: "Fill height",
        description: "Checks the editor inside a constrained tall area.",
        render: () => <MdKitScenario fillHeight />,
      },
    ],
  },
  debugger: {
    id: "debugger",
    title: "Debugger",
    description: "Docked runtime panel that resizes the app viewport.",
    scenarios: [
      {
        id: "docked-layout",
        title: "Docked",
        description: "Integrated toolbar, tabs, actions, and pushed layout.",
        render: () => <DebuggerScenario />,
      },
    ],
  },
  inspector: {
    id: "inspector",
    title: "Inspector",
    description: "Floating inspector, docked debugger, and compact dev-tool views.",
    scenarios: [
      {
        id: "floating",
        title: "Floating",
        description: "Corner-pinned inspector with small/large and dot minimize.",
        render: () => <InspectorScenario mode="floating" />,
      },
      {
        id: "debugger",
        title: "Debugger",
        description: "Docked Chrome-devtools-style panel with shared styling.",
        render: () => <InspectorScenario mode="debugger" />,
      },
      {
        id: "both",
        title: "Both",
        description: "Floating and docked shells using the same compact views.",
        render: () => <InspectorScenario mode="both" />,
      },
    ],
  },
}

const widthClasses: Record<WidthMode, string> = {
  fluid: "max-w-none",
  narrow: "max-w-2xl",
  wide: "max-w-5xl",
}

function App() {
  const [componentId, setComponentId] =
    React.useState<ComponentId>("message-input")
  const [scenarioId, setScenarioId] = React.useState("mentions-commands")
  const [widthMode, setWidthMode] = React.useState<WidthMode>("wide")
  const [themeMode, setThemeMode] = React.useState<ThemeMode>("light")
  const activeComponent = components[componentId]
  const activeScenario =
    activeComponent.scenarios.find((scenario) => scenario.id === scenarioId) ??
    activeComponent.scenarios[0]

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", themeMode === "dark")
    root.classList.toggle("light", themeMode === "light")
    localStorage.setItem("theme", themeMode)
  }, [themeMode])

  function selectComponent(nextComponentId: ComponentId) {
    setComponentId(nextComponentId)
    setScenarioId(components[nextComponentId].scenarios[0].id)
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="flex min-h-svh flex-col lg:flex-row">
        <aside className="border-b bg-muted/20 lg:w-72 lg:border-r lg:border-b-0">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <PanelLeft className="size-4 text-muted-foreground" />
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold">
                Registry playground
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                Installed from local ShadCN JSON
              </p>
            </div>
          </div>
          <nav className="grid gap-1 p-2">
            {componentOrder.map((id) => {
              const item = components[id]
              const selected = id === componentId

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectComponent(id)}
                  className={cn(
                    "rounded-md px-3 py-2 text-left text-sm transition-colors",
                    selected
                      ? "bg-background shadow-sm ring-1 ring-border"
                      : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                  )}
                >
                  <span className="block font-medium">{item.title}</span>
                  <span className="mt-0.5 block text-xs leading-4 text-muted-foreground">
                    {item.description}
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="border-b bg-background/95 px-4 py-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {activeComponent.title}
                </p>
                <h2 className="truncate text-xl font-semibold">
                  {activeScenario.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeScenario.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setThemeMode((current) =>
                      current === "dark" ? "light" : "dark"
                    )
                  }
                >
                  {themeMode === "dark" ? (
                    <Sun className="size-4" />
                  ) : (
                    <Moon className="size-4" />
                  )}
                  {themeMode === "dark" ? "Light" : "Dark"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setWidthMode((current) =>
                      current === "wide"
                        ? "narrow"
                        : current === "narrow"
                          ? "fluid"
                          : "wide"
                    )
                  }
                >
                  <Columns3 className="size-4" />
                  {widthMode}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setScenarioId(activeComponent.scenarios[0].id)
                    setWidthMode("wide")
                  }}
                >
                  <RotateCcw className="size-4" />
                  Reset
                </Button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeComponent.scenarios.map((scenario) => (
                <Button
                  key={scenario.id}
                  type="button"
                  size="sm"
                  variant={scenario.id === activeScenario.id ? "default" : "outline"}
                  onClick={() => setScenarioId(scenario.id)}
                >
                  {scenario.id === activeScenario.id ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : null}
                  {scenario.title}
                </Button>
              ))}
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4">
            <section
              className={cn(
                "mx-auto min-h-[calc(100svh-11rem)] rounded-md border bg-card p-4 shadow-sm",
                widthClasses[widthMode]
              )}
            >
              {activeScenario.render()}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
