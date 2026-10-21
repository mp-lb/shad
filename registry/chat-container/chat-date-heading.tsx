import * as React from "react";

import { cn } from "@/lib/utils";

export type ChatDateHeadingProps = React.ComponentProps<"div"> & {
  day: string;
  label: string;
};

export function ChatDateHeading({
  className,
  day,
  label,
  ...props
}: ChatDateHeadingProps) {
  return (
    <div
      data-slot="chat-date-heading"
      role="separator"
      aria-label={label}
      className={cn("flex items-center gap-3 text-xs text-muted-foreground", className)}
      {...props}
    >
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      <time dateTime={day}>{label}</time>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  );
}
