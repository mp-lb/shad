import { MdKitEditorDemo } from "@/components/mdkit-editor-demo"
import { PageHeader } from "@/components/page-header"

export default function MdKitEditorPage() {
  return (
    <article className="flex flex-col gap-6">
      <PageHeader
        title="MDKit Editor"
        description="A live local markdown editor using the same registry source installed by shadcn."
        install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/mdkit-editor.json"
      />
      <MdKitEditorDemo />
    </article>
  )
}
