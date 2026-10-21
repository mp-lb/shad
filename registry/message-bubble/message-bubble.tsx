import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type MessageBubbleProps = React.ComponentProps<"div"> & {
  side: "incoming" | "outgoing";
  label: string;
  avatar?: React.ReactNode;
};

/** A message row with an avatar slot; the primitive owns alignment and shape. */
export function MessageBubble({
  avatar,
  children,
  className,
  label,
  side,
  ...props
}: MessageBubbleProps) {
  const isOutgoing = side === "outgoing";
  const avatarNode = (
    <Avatar size="sm" aria-label={label}>
      {avatar ?? <AvatarFallback>{label.slice(0, 1).toUpperCase()}</AvatarFallback>}
    </Avatar>
  );

  return (
    <div
      data-slot="message-bubble"
      data-side={side}
      className={cn(
        "flex w-full items-end gap-2",
        isOutgoing ? "justify-end" : "justify-start",
        className,
      )}
      {...props}
    >
      {!isOutgoing && avatarNode}
      <div
        className={cn(
          "min-w-0 max-w-[min(78%,42rem)] rounded-2xl border px-3.5 py-2 text-sm leading-5 break-words",
          isOutgoing
            ? "rounded-br-md border-primary bg-primary text-primary-foreground"
            : "rounded-bl-md border-border bg-muted text-foreground",
        )}
      >
        {children}
      </div>
      {isOutgoing && avatarNode}
    </div>
  );
}
