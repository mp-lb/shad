import assert from "node:assert/strict";
import { test } from "node:test";

import {
  recommendDesktopDownload,
  renderDesktopDownload,
} from "../registry/desktop-download/desktop-download";

const downloads = [
  { platform: "macos", label: "Mac", url: "https://example.com/a.dmg" },
  { platform: "windows", label: "Windows", url: "https://example.com/a.exe" },
  { platform: "linux", format: "deb", label: "Debian", url: "https://example.com/a.deb" },
  { platform: "linux", format: "rpm", label: "Fedora", url: "https://example.com/a.rpm" },
] as const;

test("recommends an available installer for macOS, Windows and Linux", () => {
  assert.equal(recommendDesktopDownload(downloads, "Macintosh"), downloads[0]);
  assert.equal(recommendDesktopDownload(downloads, "Windows NT 10.0"), downloads[1]);
  assert.equal(recommendDesktopDownload(downloads, "X11; Linux x86_64"), downloads[2]);
  assert.equal(recommendDesktopDownload(downloads, "X11; Fedora Linux"), downloads[3]);
});

test("falls back when the platform is unsupported or its package is missing", () => {
  assert.equal(recommendDesktopDownload(downloads, "Linux; Android"), undefined);
  assert.equal(recommendDesktopDownload(downloads, "Linux aarch64"), undefined);
  assert.equal(recommendDesktopDownload(downloads.slice(0, 3), "Fedora Linux"), undefined);
  assert.equal(recommendDesktopDownload(downloads.slice(3), "Linux x86_64"), downloads[3]);
});

test("keeps downloads accessible before enhancement and escapes input", () => {
  const html = renderDesktopDownload(
    [{ ...downloads[0], label: "<macOS>" }, { ...downloads[1], url: "javascript:alert(1)" }],
    "https://example.com/releases",
  );

  assert.match(html, /href="https:\/\/example.com\/releases"/);
  assert.match(html, /<details>/);
  assert.match(html, /&lt;macOS&gt;/);
  assert.doesNotMatch(html, /javascript:/);
  assert.match(renderDesktopDownload([], "https://example.com"), /currently unavailable/);
});
