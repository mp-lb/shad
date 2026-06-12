import * as React from "react";

import { cn } from "@/lib/utils";

type AvatarStackSize = "xs" | "sm" | "md" | "lg" | "xl";

type AvatarStackOverlap = "none" | "sm" | "md" | "lg";

type AvatarStackProps = React.ComponentProps<"div"> & {
  max?: number;
  overlap?: AvatarStackOverlap;
  size?: AvatarStackSize;
};

// Presets only set the CSS variables (plus a matching text size); pass
// arbitrary diameters by overriding the variables, e.g.
// className="[--avatar-stack-size:3.5rem] [--avatar-stack-overlap:0.875rem]".
const sizeClasses: Record<AvatarStackSize, string> = {
  xs: "[--avatar-stack-size:--spacing(5)] text-[0.5rem]",
  sm: "[--avatar-stack-size:--spacing(6)] text-[0.625rem]",
  md: "[--avatar-stack-size:--spacing(8)] text-xs",
  lg: "[--avatar-stack-size:--spacing(10)] text-sm",
  xl: "[--avatar-stack-size:--spacing(12)] text-base",
};

const overlapClasses: Record<AvatarStackOverlap, string> = {
  none: "[--avatar-stack-overlap:0px]",
  sm: "[--avatar-stack-overlap:--spacing(1)]",
  md: "[--avatar-stack-overlap:--spacing(2)]",
  lg: "[--avatar-stack-overlap:--spacing(3)]",
};

export function AvatarStack({
  children,
  className,
  max,
  overlap = "md",
  size = "md",
  ...props
}: AvatarStackProps) {
  const items = React.Children.toArray(children);
  const visibleItems = max !== undefined ? items.slice(0, max) : items;
  const hiddenCount = items.length - visibleItems.length;

  return (
    <div
      data-slot="avatar-stack"
      className={cn(
        "flex -space-x-(--avatar-stack-overlap)",
        sizeClasses[size],
        overlapClasses[overlap],
        className,
      )}
      {...props}
    >
      {visibleItems}
      {hiddenCount > 0 ? (
        <AvatarStackCount>+{hiddenCount}</AvatarStackCount>
      ) : null}
    </div>
  );
}

export function AvatarStackItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-stack-item"
      className={cn(
        "relative flex size-(--avatar-stack-size) shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground ring-2 ring-background select-none",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:border-black/10 dark:after:border-white/10",
        "[&>img]:size-full [&>img]:object-cover",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarStackCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-stack-count"
      className={cn(
        "relative flex size-(--avatar-stack-size) shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground ring-2 ring-background select-none",
        className,
      )}
      {...props}
    />
  );
}
