export function CodeLine({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-md border bg-muted/35 px-3 py-2 font-mono text-xs text-muted-foreground">
      <code>{children}</code>
    </pre>
  )
}

export function CodeBlock({
  children,
  title = "Example",
}: {
  children: string
  title?: string
}) {
  return (
    <div className="overflow-hidden rounded-md border bg-muted/20">
      <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">
        {title}
      </div>
      <pre className="max-h-[520px] overflow-auto p-3 font-mono text-xs leading-5 text-muted-foreground">
        <code>{children}</code>
      </pre>
    </div>
  )
}
