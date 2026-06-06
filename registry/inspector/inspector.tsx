"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronRight,
  Circle,
  Maximize2,
  Minimize2,
  PanelBottom,
  PanelRight,
  Pin,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type InspectorCorner =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"

export type FloatingInspectorSize = "small" | "large"

export type FloatingInspectorState = {
  corner: InspectorCorner
  minimized: boolean
  size: FloatingInspectorSize
}

export type DockedDebuggerSide = "bottom" | "right"

export type DockedDebuggerSize = "small" | "large"

export type DockedDebuggerState = {
  minimized: boolean
  side: DockedDebuggerSide
  size: DockedDebuggerSize
}

export type InspectorTab = {
  id: string
  label: React.ReactNode
  count?: React.ReactNode
}

export type InspectorListItem = {
  id: string
  label: React.ReactNode
  meta?: React.ReactNode
  tone?: "default" | "info" | "success" | "warning" | "danger"
  value?: React.ReactNode
}

const floatingDefaults: FloatingInspectorState = {
  corner: "bottom-right",
  minimized: false,
  size: "small",
}

const dockedDefaults: DockedDebuggerState = {
  minimized: false,
  side: "bottom",
  size: "small",
}

const floatingCornerClasses: Record<InspectorCorner, string> = {
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "right-3 bottom-3",
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3",
}

const floatingSizeClasses: Record<FloatingInspectorSize, string> = {
  large:
    "h-[min(42rem,calc(100dvh-1.5rem))] w-[min(42rem,calc(100dvw-1.5rem))]",
  small: "h-[26rem] w-[min(28rem,calc(100dvw-1.5rem))]",
}

const dockedSizeClasses: Record<DockedDebuggerSide, Record<DockedDebuggerSize, string>> = {
  bottom: {
    large: "h-[min(34rem,65dvh)]",
    small: "h-[min(22rem,46dvh)]",
  },
  right: {
    large: "w-[min(42rem,70dvw)]",
    small: "w-[min(31rem,56dvw)]",
  },
}

const toneClasses: Record<NonNullable<InspectorListItem["tone"]>, string> = {
  danger: "bg-rose-500",
  default: "bg-muted-foreground/45",
  info: "bg-sky-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
}

function readStoredState<TState>(storageKey: string | undefined, fallback: TState) {
  if (!storageKey || typeof window === "undefined") return fallback

  try {
    const raw = window.localStorage.getItem(storageKey)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

function useStoredInspectorState<TState extends object>(
  storageKey: string | undefined,
  fallback: TState
) {
  const [state, setState] = React.useState<TState>(() =>
    readStoredState(storageKey, fallback)
  )

  React.useEffect(() => {
    if (!storageKey || typeof window === "undefined") return
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state, storageKey])

  return [state, setState] as const
}

function nextCorner(corner: InspectorCorner): InspectorCorner {
  switch (corner) {
    case "bottom-right":
      return "top-right"
    case "top-right":
      return "top-left"
    case "top-left":
      return "bottom-left"
    case "bottom-left":
      return "bottom-right"
  }
}

function InspectorIconButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring [&_svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

function InspectorHeader({
  actions,
  children,
  title,
}: {
  actions: React.ReactNode
  children?: React.ReactNode
  title: React.ReactNode
}) {
  return (
    <header className="flex h-8 shrink-0 items-center gap-1 border-b border-border/70 bg-muted/25 px-1.5 font-mono text-[10px] leading-none">
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <span className="min-w-0 truncate font-medium text-foreground">
          {title}
        </span>
        {children}
      </div>
      <div className="flex items-center gap-0.5">{actions}</div>
    </header>
  )
}

export function FloatingInspector({
  children,
  className,
  defaultState,
  onClose,
  storageKey = "mp-lb-floating-inspector",
  title,
}: Omit<React.ComponentProps<"section">, "title"> & {
  defaultState?: Partial<FloatingInspectorState>
  onClose?: () => void
  storageKey?: string
  title: React.ReactNode
}) {
  const [state, setState] = useStoredInspectorState<FloatingInspectorState>(
    storageKey,
    { ...floatingDefaults, ...defaultState }
  )

  if (state.minimized) {
    return (
      <button
        type="button"
        className={cn(
          "fixed z-50 inline-flex size-3.5 items-center justify-center rounded-full border border-border/70 bg-foreground/45 text-background opacity-55 shadow-sm outline-none transition hover:size-5 hover:opacity-100 focus-visible:size-5 focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-ring",
          floatingCornerClasses[state.corner]
        )}
        aria-label="Restore inspector"
        onClick={() => setState((current) => ({ ...current, minimized: false }))}
      >
        <Circle className="size-1.5 fill-current" />
      </button>
    )
  }

  return (
    <section
      data-slot="floating-inspector"
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden rounded-md border border-border/80 bg-background/98 text-foreground shadow-2xl backdrop-blur",
        floatingCornerClasses[state.corner],
        floatingSizeClasses[state.size],
        className
      )}
      aria-label={typeof title === "string" ? title : "Inspector"}
    >
      <InspectorHeader
        title={title}
        actions={
          <>
            <InspectorIconButton
              aria-label="Move inspector"
              onClick={() =>
                setState((current) => ({
                  ...current,
                  corner: nextCorner(current.corner),
                }))
              }
            >
              <Pin />
            </InspectorIconButton>
            <InspectorIconButton
              aria-label={
                state.size === "large"
                  ? "Use small inspector"
                  : "Use large inspector"
              }
              onClick={() =>
                setState((current) => ({
                  ...current,
                  size: current.size === "large" ? "small" : "large",
                }))
              }
            >
              {state.size === "large" ? <Minimize2 /> : <Maximize2 />}
            </InspectorIconButton>
            <InspectorIconButton
              aria-label="Minimize inspector"
              onClick={() =>
                setState((current) => ({ ...current, minimized: true }))
              }
            >
              <ChevronDown />
            </InspectorIconButton>
            {onClose ? (
              <InspectorIconButton aria-label="Close inspector" onClick={onClose}>
                <X />
              </InspectorIconButton>
            ) : null}
          </>
        }
      />
      <div className="min-h-0 flex-1 overflow-auto p-2">{children}</div>
    </section>
  )
}

export function DockedDebugger({
  children,
  className,
  defaultState,
  storageKey = "mp-lb-docked-debugger",
  title,
}: Omit<React.ComponentProps<"section">, "title"> & {
  defaultState?: Partial<DockedDebuggerState>
  storageKey?: string
  title: React.ReactNode
}) {
  const [state, setState] = useStoredInspectorState<DockedDebuggerState>(
    storageKey,
    { ...dockedDefaults, ...defaultState }
  )

  if (state.minimized) {
    return (
      <button
        type="button"
        className={cn(
          "fixed z-50 inline-flex items-center gap-1 rounded-sm border border-border/80 bg-background/95 px-1.5 py-1 font-mono text-[10px] text-muted-foreground shadow-lg outline-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring",
          state.side === "bottom"
            ? "right-3 bottom-3"
            : "top-3 right-3 [writing-mode:vertical-rl]"
        )}
        onClick={() => setState((current) => ({ ...current, minimized: false }))}
      >
        <Circle className="size-1.5 fill-current" />
        {title}
      </button>
    )
  }

  return (
    <section
      data-slot="docked-debugger"
      className={cn(
        "fixed z-50 flex overflow-hidden border-border/80 bg-background/98 text-foreground shadow-2xl backdrop-blur",
        state.side === "bottom"
          ? "inset-x-0 bottom-0 flex-col border-t"
          : "inset-y-0 right-0 flex-col border-l",
        dockedSizeClasses[state.side][state.size],
        className
      )}
      aria-label={typeof title === "string" ? title : "Debugger"}
    >
      <InspectorHeader
        title={title}
        actions={
          <>
            <InspectorIconButton
              aria-label={
                state.side === "bottom"
                  ? "Dock debugger right"
                  : "Dock debugger bottom"
              }
              onClick={() =>
                setState((current) => ({
                  ...current,
                  side: current.side === "bottom" ? "right" : "bottom",
                }))
              }
            >
              {state.side === "bottom" ? <PanelRight /> : <PanelBottom />}
            </InspectorIconButton>
            <InspectorIconButton
              aria-label={
                state.size === "large"
                  ? "Use small debugger"
                  : "Use large debugger"
              }
              onClick={() =>
                setState((current) => ({
                  ...current,
                  size: current.size === "large" ? "small" : "large",
                }))
              }
            >
              {state.size === "large" ? <Minimize2 /> : <Maximize2 />}
            </InspectorIconButton>
            <InspectorIconButton
              aria-label="Minimize debugger"
              onClick={() =>
                setState((current) => ({ ...current, minimized: true }))
              }
            >
              {state.side === "bottom" ? <ChevronDown /> : <ChevronRight />}
            </InspectorIconButton>
          </>
        }
      />
      <div className="min-h-0 flex-1 overflow-auto p-2">{children}</div>
    </section>
  )
}

export function InspectorTabs({
  activeTab,
  className,
  onTabChange,
  tabs,
}: {
  activeTab: string
  className?: string
  onTabChange: (tabId: string) => void
  tabs: InspectorTab[]
}) {
  return (
    <div
      data-slot="inspector-tabs"
      className={cn(
        "flex min-w-0 items-center gap-0.5 overflow-x-auto border-b border-border/70 bg-muted/15 p-1 font-mono text-[10px]",
        className
      )}
    >
      {tabs.map((tab) => {
        const selected = tab.id === activeTab

        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={selected}
            className={cn(
              "inline-flex h-5 shrink-0 items-center gap-1 rounded-sm px-1.5 text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring",
              selected && "bg-background text-foreground shadow-sm ring-1 ring-border/70"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined ? (
              <span className="text-[9px] text-muted-foreground">
                {tab.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export function InspectorList({
  className,
  items,
}: {
  className?: string
  items: InspectorListItem[]
}) {
  return (
    <div
      data-slot="inspector-list"
      className={cn(
        "overflow-hidden rounded-sm border border-border/70 font-mono text-[10px] leading-4",
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="grid min-h-7 grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-border/60 px-2 py-1 last:border-b-0"
        >
          <div className="flex min-w-0 items-start gap-1.5">
            <span
              className={cn(
                "mt-1 size-1.5 shrink-0 rounded-full",
                toneClasses[item.tone ?? "default"]
              )}
            />
            <div className="min-w-0">
              <div className="truncate text-foreground">{item.label}</div>
              {item.meta ? (
                <div className="truncate text-muted-foreground">{item.meta}</div>
              ) : null}
            </div>
          </div>
          {item.value ? (
            <div className="max-w-28 truncate text-right text-muted-foreground">
              {item.value}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function InspectorMetricGrid({
  className,
  metrics,
}: {
  className?: string
  metrics: Array<{ label: React.ReactNode; value: React.ReactNode }>
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border/70 bg-border/70 font-mono text-[10px] md:grid-cols-4",
        className
      )}
    >
      {metrics.map((metric, index) => (
        <div key={index} className="min-w-0 bg-background px-2 py-1.5">
          <div className="truncate text-muted-foreground">{metric.label}</div>
          <div className="truncate text-xs font-medium text-foreground">
            {metric.value}
          </div>
        </div>
      ))}
    </div>
  )
}

export function InspectorSection({
  children,
  className,
  title,
}: React.ComponentProps<"div"> & { title?: React.ReactNode }) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      {title ? (
        <div className="font-mono text-[10px] font-medium uppercase text-muted-foreground">
          {title}
        </div>
      ) : null}
      {children}
    </div>
  )
}
