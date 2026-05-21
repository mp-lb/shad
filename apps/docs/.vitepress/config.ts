import { defineConfig } from "vitepress"

export default defineConfig({
  title: "@mp-lb/shad",
  description: "shadcn registry for MP-LB components",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Components", link: "/components/structured-log-viewer" },
      { text: "Registry", link: "/registry" },
    ],
    sidebar: [
      {
        text: "Components",
        items: [
          {
            text: "Structured Log Viewer",
            link: "/components/structured-log-viewer",
          },
        ],
      },
    ],
  },
})
