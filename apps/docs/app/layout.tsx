import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://shad.mp-lb.dev"),
  title: {
    default: "@mp-lb/shad",
    template: "%s | @mp-lb/shad",
  },
  description: "shadcn registry for MP-LB components.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
