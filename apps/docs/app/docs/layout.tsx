import type { ReactNode } from "react";
import { Github } from "lucide-react";
import { DocsLayout as FumadocsDocsLayout } from "fumadocs-ui/layouts/docs";
import { componentTree } from "@/lib/component-tree";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <FumadocsDocsLayout
      tree={componentTree}
      nav={{ title: "@mp-lb/shad", url: "/docs" }}
      links={[
        {
          type: "icon",
          text: "GitHub",
          label: "GitHub",
          url: "https://github.com/mp-lb/shad",
          icon: <Github className="size-4" />,
          external: true,
        },
      ]}
    >
      {children}
    </FumadocsDocsLayout>
  );
}
