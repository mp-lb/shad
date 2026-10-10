import { readFileSync, existsSync } from "node:fs"
import { registerHooks } from "node:module"
import { fileURLToPath } from "node:url"
import ts from "typescript"

// Resolve the registry's consumer aliases against the docs app for headless rendering.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      specifier = new URL(`../apps/docs/${specifier.slice(2)}`, import.meta.url).href
    }
    if (specifier.startsWith("file:") || specifier.startsWith(".")) {
      const url = new URL(specifier, context.parentURL)
      for (const extension of ["", ".tsx", ".ts"]) {
        if (existsSync(fileURLToPath(url) + extension)) {
          return nextResolve(url.href + extension, context)
        }
      }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (/\.tsx?$/.test(url)) {
      return {
        format: "module",
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
          compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
        }).outputText,
      }
    }
    return nextLoad(url, context)
  },
})
