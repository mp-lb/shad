export type DesktopDownload = {
  url: string;
  label: string;
  platform: "macos" | "windows" | "linux";
  format?: "deb" | "rpm";
};

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );

const icon = (path: string) =>
  `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;

const downloadIcon = icon("M12 3v12m-5-5 5 5 5-5M5 15v5h14v-5");
const chevron = icon("m6 9 6 6 6-6");

export const renderDesktopDownload = (
  downloads: readonly DesktopDownload[],
  releaseUrl: string,
) => {
  const available = downloads.filter(
    ({ url }) => URL.canParse(url) && new URL(url).protocol === "https:",
  );

  if (!available.length)
    return '<p class="desktop-download-status" role="status">Desktop downloads are currently unavailable.</p>';

  const fallback =
    URL.canParse(releaseUrl) && new URL(releaseUrl).protocol === "https:"
      ? releaseUrl
      : available[0]!.url;

  const choices = available
    .map(
      ({ url, label, platform, format }) =>
        `<li><a href="${escapeHtml(url)}" data-platform="${escapeHtml(platform)}" data-format="${escapeHtml(format ?? "")}">${escapeHtml(label)}</a></li>`,
    )
    .join("");

  return `<div class="desktop-download" data-desktop-download>
    <div class="desktop-download-actions">
      <a class="desktop-download-primary" href="${escapeHtml(fallback)}">${downloadIcon}<span>All downloads</span></a>
      <details>
        <summary aria-label="Choose a desktop download">${chevron}</summary>
        <ul aria-label="Desktop downloads">${choices}</ul>
      </details>
    </div>
    <small data-download-details>Choose your operating system</small>
  </div>`;
};

export const recommendDesktopDownload = <
  Option extends Pick<DesktopDownload, "platform" | "format">,
>(
  options: readonly Option[],
  userAgent: string,
) => {
  if (/Android|iPhone|iPad|iPod|Mobile|CrOS/i.test(userAgent)) return undefined;
  if (/Windows/i.test(userAgent) && !/ARM|aarch64/i.test(userAgent))
    return options.find(({ platform }) => platform === "windows");
  if (/Macintosh|Mac OS X/i.test(userAgent))
    return options.find(({ platform }) => platform === "macos");
  if (!/Linux/i.test(userAgent) || /ARM|aarch64/i.test(userAgent))
    return undefined;

  const linux = options.filter(({ platform }) => platform === "linux");
  if (/Fedora|RHEL|Red Hat|CentOS|SUSE|Rocky|AlmaLinux/i.test(userAgent))
    return linux.find(({ format }) => format === "rpm");
  if (/Ubuntu|Debian|Linux Mint/i.test(userAgent))
    return linux.find(({ format }) => format === "deb");

  return linux.find(({ format }) => format === "deb") ?? linux[0];
};

export const enhanceDesktopDownload = (
  root: HTMLElement,
  userAgent = navigator.userAgent,
) => {
  const details = root.querySelector("details");
  const summary = details?.querySelector("summary");

  const primary = root.querySelector<HTMLAnchorElement>(
    ".desktop-download-primary",
  );

  const label = primary?.querySelector("span");
  const hint = root.querySelector("[data-download-details]");
  if (!details || !summary || !primary || !label || !hint) return;

  const options = Array.from(
    root.querySelectorAll<HTMLAnchorElement>("a[data-platform]"),
    (link) => ({
      platform: link.dataset.platform as DesktopDownload["platform"],
      format: link.dataset.format as DesktopDownload["format"],
      link,
    }),
  );

  const preferred = recommendDesktopDownload(options, userAgent);

  if (preferred) {
    primary.href = preferred.link.href;
    primary.setAttribute(
      "aria-label",
      `Download for ${preferred.link.textContent}`,
    );
    label.textContent = "Download";
    hint.textContent = preferred.link.textContent;
  }

  const dismiss = (event: Event) => {
    if (event.target instanceof Node && !details.contains(event.target))
      details.open = false;
  };

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !details.open) return;
    details.open = false;
    summary.focus();
  };

  root.ownerDocument.addEventListener("click", dismiss);
  details.addEventListener("keydown", closeOnEscape);

  return () => {
    root.ownerDocument.removeEventListener("click", dismiss);
    details.removeEventListener("keydown", closeOnEscape);
  };
};
