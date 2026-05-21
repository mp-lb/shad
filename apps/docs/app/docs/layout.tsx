import Link from "next/link"
import type { ReactNode } from "react"
import { Braces, FileText, ListTree, Terminal } from "lucide-react"

const navItems = [
  { href: "/docs/components/mdkit-editor", label: "MDKit Editor", icon: FileText },
  { href: "/docs/components/json-viewer", label: "JSON Viewer", icon: Braces },
  {
    href: "/docs/components/structured-log-viewer",
    label: "Structured Log Viewer",
    icon: Terminal,
  },
]

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/docs" className="flex items-center gap-2 font-semibold">
            <ListTree className="size-4" />
            @mp-lb/shad
          </Link>
          <nav className="ml-auto hidden items-center gap-1 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <nav className="sticky top-20 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}
