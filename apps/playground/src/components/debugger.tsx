"use client"

import * as React from "react"
import {
  AlertTriangle,
  Database,
  Loader2,
  RefreshCw,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import { DockedDebugger, InspectorMetricGrid } from "@/components/inspector"
import { cn } from "@/lib/utils"

export type DebuggerMetric = {
  label: React.ReactNode
  value: React.ReactNode
}

export type DebuggerAction = {
  disabled?: boolean
  icon?: LucideIcon
  label: React.ReactNode
  onClick: () => void
  tone?: "default" | "danger"
}

export type DebuggerColumn<TRow> = {
  className?: string
  header: React.ReactNode
  render: (row: TRow) => React.ReactNode
}

export type DebuggerPanelProps<TRow> = Omit<
  React.ComponentProps<"section">,
  "children" | "title"
> & {
  actions?: DebuggerAction[]
  columns: DebuggerColumn<TRow>[]
  emptyIcon?: LucideIcon
  emptyMessage?: React.ReactNode
  error?: React.ReactNode
  getRowId: (row: TRow, index: number) => React.Key
  isLoading?: boolean
  maxHeight?: number
  metrics?: DebuggerMetric[]
  rows: TRow[]
  title?: React.ReactNode
}

type DockedDebuggerProps = React.ComponentProps<typeof DockedDebugger>

export type DebuggerDockProps<TRow> = Omit<
  DebuggerPanelProps<TRow>,
  "className"
> &
  Pick<
    DockedDebuggerProps,
    | "closeDisabled"
    | "defaultState"
    | "onClose"
    | "onOpenChange"
    | "open"
    | "showCloseButton"
    | "storageKey"
  > & {
    dockTitle?: React.ReactNode
    className?: string
    panelClassName?: string
  }

function DebuggerActionButton({
  action,
}: {
  action: DebuggerAction
}) {
  const Icon = action.icon

  return (
    <button
      type="button"
      disabled={action.disabled}
      onClick={action.onClick}
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 rounded-sm border border-border/70 px-1.5 font-mono text-[10px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3",
        action.tone === "danger" &&
          "border-rose-500/30 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
      )}
    >
      {Icon ? <Icon /> : null}
      <span>{action.label}</span>
    </button>
  )
}

function DebuggerEmptyState({
  icon: Icon = Database,
  message,
}: {
  icon?: LucideIcon
  message: React.ReactNode
}) {
  return (
    <div className="flex min-h-24 items-center justify-center gap-1.5 p-4 font-mono text-[10px] text-muted-foreground">
      <Icon className="size-3" />
      <span>{message}</span>
    </div>
  )
}

export function DebuggerPanel<TRow>({
  actions = [],
  className,
  columns,
  emptyIcon,
  emptyMessage = "No debugger rows.",
  error,
  getRowId,
  isLoading = false,
  maxHeight = 360,
  metrics = [],
  rows,
  title = "Debugger",
  ...props
}: DebuggerPanelProps<TRow>) {
  return (
    <section
      data-slot="debugger-panel"
      className={cn(
        "overflow-hidden rounded-md border border-border/70 bg-background font-mono text-[10px] leading-4 text-foreground shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex min-h-8 items-center gap-1.5 border-b border-border/70 bg-muted/25 px-2 py-1">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-medium">{title}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
          {isLoading ? <Loader2 className="size-3 animate-spin" /> : null}
          <span>{rows.length} rows</span>
        </div>
        {actions.length ? (
          <div className="flex shrink-0 items-center gap-1">
            {actions.map((action, index) => (
              <DebuggerActionButton key={index} action={action} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-2 p-2">
        {metrics.length ? <InspectorMetricGrid metrics={metrics} /> : null}

        {error ? (
          <div className="flex items-start gap-1.5 rounded-sm border border-rose-500/30 bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="mt-0.5 size-3 shrink-0" />
            <div className="min-w-0 break-words">{error}</div>
          </div>
        ) : null}

        <div
          className="overflow-auto rounded-sm border border-border/70"
          style={{ maxHeight }}
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
            <DebuggerEmptyState icon={emptyIcon} message={emptyMessage} />
          )}
        </div>
      </div>
    </section>
  )
}

export function DebuggerDock<TRow>({
  className,
  closeDisabled,
  defaultState,
  dockTitle,
  onClose,
  onOpenChange,
  open,
  panelClassName,
  showCloseButton,
  storageKey,
  title,
  ...panelProps
}: DebuggerDockProps<TRow>) {
  return (
    <DockedDebugger
      className={className}
      closeDisabled={closeDisabled}
      defaultState={defaultState}
      onClose={onClose}
      onOpenChange={onOpenChange}
      open={open}
      showCloseButton={showCloseButton}
      storageKey={storageKey}
      title={dockTitle ?? title ?? "Debugger"}
    >
      <DebuggerPanel className={panelClassName} title={title} {...panelProps} />
    </DockedDebugger>
  )
}

export const defaultDebuggerActions = {
  clear: Trash2,
  refresh: RefreshCw,
}
