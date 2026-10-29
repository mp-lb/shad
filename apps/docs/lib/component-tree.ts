import { source } from "@/lib/source";

const folder = source.pageTree.children.find(
  (node) =>
    node.type === "folder" &&
    node.children.some(
      (child) =>
        child.type === "page" && child.url.startsWith("/docs/components/"),
    ),
);

export const componentTree = {
  ...source.pageTree,
  children: folder?.type === "folder" ? folder.children : [],
};
