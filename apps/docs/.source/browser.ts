// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "components/array-editor.mdx": () => import("../content/docs/components/array-editor.mdx?collection=docs"), "components/inspector.mdx": () => import("../content/docs/components/inspector.mdx?collection=docs"), "components/json-viewer.mdx": () => import("../content/docs/components/json-viewer.mdx?collection=docs"), "components/mdkit-editor.mdx": () => import("../content/docs/components/mdkit-editor.mdx?collection=docs"), "components/message-input.mdx": () => import("../content/docs/components/message-input.mdx?collection=docs"), "components/modal.mdx": () => import("../content/docs/components/modal.mdx?collection=docs"), "components/structured-log-viewer.mdx": () => import("../content/docs/components/structured-log-viewer.mdx?collection=docs"), "components/ui-states.mdx": () => import("../content/docs/components/ui-states.mdx?collection=docs"), }),
};
export default browserCollections;