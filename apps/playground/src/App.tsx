import * as React from "react"
import {
  Bot,
  CheckCircle2,
  Columns3,
  FileText,
  Mic,
  Moon,
  PanelLeft,
  RotateCcw,
  Search,
  Sparkles,
  Sun,
  Wand2,
} from "lucide-react"

import {
  ArrayEditor,
  type ArrayEditorObjectItem,
} from "@/components/array-editor"
import { JsonViewer } from "@/components/json-viewer"
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
import { cn } from "@/lib/utils"

type ComponentId =
  | "message-input"
  | "json-viewer"
  | "array-editor"
  | "structured-log-viewer"
  | "modal"
  | "ui-states"
  | "mdkit-editor"

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
  "ui-states",
  "mdkit-editor",
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

  return (
    <div className="grid gap-4">
      <MessageInput
        composerClassName="border shadow-sm"
        placeholder={
          commands
            ? "Ask Orb to summarize @Ada or use /rewrite..."
            : "Tag a person, bot, or document with @..."
        }
        entities={messageEntities}
        commands={commands ? messageCommands : []}
        onAttachmentClick={() => undefined}
        leadingActions={
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label="Search context"
            >
              <Search className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label="Voice input"
            >
              <Mic className="size-4" />
            </Button>
          </>
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
          {JSON.stringify(
            payload ?? { text: "", entities: [], command: null },
            null,
            2
          )}
        </pre>
      </div>
    </div>
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
