import { redirect } from "next/navigation";
import { componentTree } from "@/lib/component-tree";

export default function DocsIndexPage() {
  const firstComponent = componentTree.children.find(
    (node) => node.type === "page",
  );
  if (!firstComponent || firstComponent.type !== "page") return null;
  redirect(firstComponent.url);
}
