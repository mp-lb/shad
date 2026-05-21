# MDKit Editor

shadcn-rendered markdown editor shell for `@mp-lb/mdkit`.

```bash
pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/mdkit-editor.json
```

## Local Editor

```tsx
import { MdKitLocalEditor } from "@/components/mdkit-editor"

export function Editor() {
  const [markdown, setMarkdown] = useState("# Hello")

  return (
    <MdKitLocalEditor
      value={markdown}
      onChange={setMarkdown}
    />
  )
}
```

## Connected Editor

```tsx
import { MdKitConnectedEditor } from "@/components/mdkit-editor"

export function ConnectedEditor({
  collaboration,
  document,
  onRestoreVersion,
  versions,
}) {
  return (
    <MdKitConnectedEditor
      collaboration={collaboration}
      document={document}
      onRestoreVersion={onRestoreVersion}
      versions={versions}
    />
  )
}
```

The component owns shadcn rendering only. Storage, collaboration, and versioning
logic still come from `@mp-lb/mdkit`.
