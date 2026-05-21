import { defineConfig } from "vitepress"

export default defineConfig({
  title: "@mp-lb/shad",
  description: "shadcn registry for MP-LB components",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Components", link: "/components/mdkit-editor" },
      { text: "Registry", link: "/registry" },
    ],
    sidebar: [
      {
        text: "Components",
        items: [
          {
            text: "MDKit Editor",
            link: "/components/mdkit-editor",
          },
          {
            text: "JSON Viewer",
            link: "/components/json-viewer",
          },
          {
            text: "Structured Log Viewer",
            link: "/components/structured-log-viewer",
          },
        ],
      },
    ],
  },
})
