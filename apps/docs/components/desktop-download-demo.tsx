import { DesktopDownloadButton } from "../../../registry/desktop-download/DesktopDownloadButton";

const releaseUrl = "https://github.com/mp-lb/berth-releases/releases/latest";
const downloads = [
  { platform: "macos", label: "macOS · Apple Silicon (.dmg)", url: `${releaseUrl}/download/Berth-arm64.dmg` },
  { platform: "linux", format: "deb", label: "Linux · Debian / Ubuntu (.deb)", url: `${releaseUrl}/download/Berth-linux-amd64.deb` },
] as const;

export function DesktopDownloadDemo() {
  return <DesktopDownloadButton downloads={downloads} releaseUrl={releaseUrl} />;
}
