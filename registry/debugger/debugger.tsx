"use client"

import * as React from "react"
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Circle,
  Maximize2,
  Minimize2,
  PanelBottom,
  PanelRight,
  X,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type DebuggerDockSide = "bottom" | "right"
export type DebuggerDockSize = "compact" | "expanded"

export type DebuggerTab = {
  count?: React.ReactNode
  id: string
  label: React.ReactNode
}

export type DebuggerAction = {
  disabled?: boolean
  icon?: LucideIcon
  id: string
  label: React.ReactNode
  onClick: () => void
  tone?: "default" | "danger"
}

export type DebuggerMetric = {
  label: React.ReactNode
  value: React.ReactNode
}

export type DebuggerColumn<TRow> = {
  className?: string
  header: React.ReactNode
  render: (row: TRow) => React.ReactNode
}

export type DebuggerViewportProps = React.ComponentProps<"div"> & {
  debugger: React.ReactNode
  debuggerOpen?: boolean
  mainClassName?: string
  side?: DebuggerDockSide
}

export type DebuggerDockProps = Omit<
  React.ComponentProps<"section">,
  "children" | "title"
> & {
  actions?: DebuggerAction[]
  activeTab?: string
  children: React.ReactNode
  closeDisabled?: boolean
  onOpenChange?: (open: boolean) => void
  onSideChange?: (side: DebuggerDockSide) => void
  onSizeChange?: (size: DebuggerDockSize) => void
  onTabChange?: (tabId: string) => void
  open?: boolean
  side?: DebuggerDockSide
  size?: DebuggerDockSize
  tabs?: DebuggerTab[]
  title: React.ReactNode
}

export type DebuggerTableProps<TRow> = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  columns: DebuggerColumn<TRow>[]
  emptyMessage?: React.ReactNode
  getRowId: (row: TRow, index: number) => React.Key
  rows: TRow[]
}

const dockSizeClasses: Record<DebuggerDockSide, Record<DebuggerDockSize, string>> = {
  bottom: {
    compact: "max-h-[min(16rem,45dvh)]",
    expanded: "max-h-[min(28rem,65dvh)]",
  },
  right: {
    compact: "max-w-[min(28rem,48dvw)]",
    expanded: "max-w-[min(42rem,68dvw)]",
  },
}

function DebuggerIconButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-35 [&_svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

function DebuggerActionButton({ action }: { action: DebuggerAction }) {
  const Icon = action.icon

  return (
    <button
      type="button"
      disabled={action.disabled}
      onClick={action.onClick}
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1 rounded-sm px-1.5 font-mono text-[10px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-35 [&_svg]:size-3",
        action.tone === "danger" &&
          "text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
      )}
    >
      {Icon ? <Icon /> : null}
      <span>{action.label}</span>
    </button>
  )
}

function DebuggerTabs({
  activeTab,
  onTabChange,
  tabs,
}: {
  activeTab?: string
  onTabChange?: (tabId: string) => void
  tabs: DebuggerTab[]
}) {
  return (
    <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
      {tabs.map((tab) => {
        const selected = tab.id === activeTab

        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={selected}
            className={cn(
              "inline-flex h-5 shrink-0 items-center gap-1 rounded-sm px-1.5 font-mono text-[10px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring",
              selected && "bg-background text-foreground shadow-sm ring-1 ring-border/70"
            )}
            onClick={() => onTabChange?.(tab.id)}
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

export function DebuggerViewport({
  children,
  className,
  debugger: debuggerNode,
  debuggerOpen = true,
  mainClassName,
  side = "bottom",
  ...props
}: DebuggerViewportProps) {
  return (
    <div
      data-slot="debugger-viewport"
      className={cn(
        "flex min-h-0 min-w-0 overflow-hidden",
        side === "right" ? "flex-row" : "flex-col",
        className
      )}
      {...props}
    >
      <div
        data-slot="debugger-main"
        className={cn("min-h-0 min-w-0 flex-1 overflow-hidden", mainClassName)}
      >
        {children}
      </div>
      {debuggerOpen ? debuggerNode : null}
    </div>
  )
}

export function DebuggerDock({
  actions = [],
  activeTab,
  children,
  className,
  closeDisabled = false,
  onOpenChange,
  onSideChange,
  onSizeChange,
  onTabChange,
  open = true,
  side = "bottom",
  size = "compact",
  tabs = [],
  title,
  ...props
}: DebuggerDockProps) {
  if (!open) {
    return null
  }

  return (
    <section
      data-slot="debugger-dock"
      className={cn(
        "flex shrink-0 overflow-hidden border-border/80 bg-background font-mono text-[10px] leading-4 text-foreground shadow-sm",
        side === "right" ? "h-full w-max flex-col border-l" : "w-full flex-col border-t",
        dockSizeClasses[side][size],
        className
      )}
      {...props}
    >
      <header className="flex min-h-7 shrink-0 items-center gap-1 border-b border-border/70 bg-muted/25 px-1.5">
        <div className="flex min-w-0 shrink-0 items-center gap-1.5">
          <Circle className="size-1.5 fill-current text-muted-foreground" />
          <div className="max-w-36 truncate font-medium">{title}</div>
        </div>
        {tabs.length ? (
          <div className="min-w-0 flex-1">
            <DebuggerTabs
              activeTab={activeTab}
              onTabChange={onTabChange}
              tabs={tabs}
            />
          </div>
        ) : (
          <div className="min-w-0 flex-1" />
        )}
        <div className="flex shrink-0 items-center gap-0.5">
          {actions.map((action) => (
            <DebuggerActionButton key={action.id} action={action} />
          ))}
          <DebuggerIconButton
            aria-label={
              side === "bottom" ? "Dock debugger right" : "Dock debugger bottom"
            }
            onClick={() => onSideChange?.(side === "bottom" ? "right" : "bottom")}
          >
            {side === "bottom" ? <PanelRight /> : <PanelBottom />}
          </DebuggerIconButton>
          <DebuggerIconButton
            aria-label={
              size === "expanded"
                ? "Use compact debugger"
                : "Use expanded debugger"
            }
            onClick={() =>
              onSizeChange?.(size === "expanded" ? "compact" : "expanded")
            }
          >
            {size === "expanded" ? <Minimize2 /> : <Maximize2 />}
          </DebuggerIconButton>
          <DebuggerIconButton
            aria-label="Minimize debugger"
            onClick={() => onOpenChange?.(false)}
          >
            {side === "bottom" ? <ChevronDown /> : <ChevronRight />}
          </DebuggerIconButton>
          <DebuggerIconButton
            aria-label="Close debugger"
            disabled={closeDisabled}
            onClick={() => onOpenChange?.(false)}
          >
            <X />
          </DebuggerIconButton>
        </div>
      </header>
      <div data-slot="debugger-body" className="min-h-0 overflow-auto">
        {children}
      </div>
    </section>
  )
}

export function DebuggerMetrics({
  className,
  metrics,
}: {
  className?: string
  metrics: DebuggerMetric[]
}) {
  return (
    <div
      data-slot="debugger-metrics"
      className={cn(
        "grid grid-cols-2 gap-px border-b border-border/70 bg-border/70 md:grid-cols-4",
        className
      )}
    >
      {metrics.map((metric, index) => (
        <div key={index} className="min-w-0 bg-background px-2 py-1">
          <div className="truncate text-muted-foreground">{metric.label}</div>
          <div className="truncate font-medium text-foreground">
            {metric.value}
          </div>
        </div>
      ))}
    </div>
  )
}

export function DebuggerNotice({
  children,
  className,
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="debugger-notice"
      className={cn(
        "flex items-start gap-1.5 border-b border-rose-500/25 bg-rose-500/10 px-2 py-1 text-rose-600 dark:text-rose-400",
        className
      )}
    >
      <AlertTriangle className="mt-0.5 size-3 shrink-0" />
      <div className="min-w-0 break-words">{children}</div>
    </div>
  )
}

export function DebuggerTable<TRow>({
  className,
  columns,
  emptyMessage = "No debugger rows.",
  getRowId,
  rows,
  ...props
}: DebuggerTableProps<TRow>) {
  return (
    <div
      data-slot="debugger-table"
      className={cn("overflow-auto", className)}
      {...props}
    >
      {rows.length ? (
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-background">
            <tr className="border-b border-border/70">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "px-2 py-1 font-medium text-muted-foreground",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={getRowId(row, rowIndex)}
                className="border-b border-border/60 last:border-b-0"
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={cn(
                      "max-w-64 truncate px-2 py-1 align-top",
                      column.className
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex min-h-20 items-center justify-center px-2 py-4 text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </div>
  )
}
