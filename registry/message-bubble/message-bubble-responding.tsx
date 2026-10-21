import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type MessageBubbleRespondingProps = React.ComponentProps<"div"> & {
  label: string;
  avatar?: React.ReactNode;
};

/** An incoming avatar and faint activity dots aligned to the bubble's left edge. */
export function MessageBubbleResponding({
  avatar,
  className,
  label,
  ...props
}: MessageBubbleRespondingProps) {
  return (
    <div
      data-slot="message-bubble-responding"
      role="status"
      aria-label={`${label} is responding`}
      className={cn("flex w-full items-end gap-2", className)}
      {...props}
    >
      <Avatar size="sm" aria-label={label}>
        {avatar ?? <AvatarFallback>{label.slice(0, 1).toUpperCase()}</AvatarFallback>}
      </Avatar>
      <span aria-hidden="true" className="flex items-center gap-1.5 py-2">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="size-1.5 bg-muted-foreground/30 motion-safe:animate-pulse"
            style={{ animationDelay: `${index * 220}ms` }}
          />
        ))}
      </span>
    </div>
  );
}
