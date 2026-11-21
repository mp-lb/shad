"use client";

import { useEffect, useRef } from "react";
import { enhanceDesktopDownload, renderDesktopDownload } from "./desktop-download";
import type { DesktopDownload } from "./desktop-download";
import "./desktop-download.css";

export function DesktopDownloadButton({ downloads, releaseUrl }: {
  downloads: readonly DesktopDownload[];
  releaseUrl: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const html = renderDesktopDownload(downloads, releaseUrl);

  useEffect(() => {
    const button = container.current?.querySelector<HTMLElement>("[data-desktop-download]");
    if (button) return enhanceDesktopDownload(button);
  }, [html]);

  return <div ref={container} dangerouslySetInnerHTML={{ __html: html }} />;
}
