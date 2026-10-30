"use client";

import { cn } from "@/lib/utils";
import { DotmLoading } from "./dotm-loading";

type FullScreenLoadingProps = {
  label?: string;
  className?: string;
};

export const FullScreenLoading = ({
  label = "Loading",
  className,
}: FullScreenLoadingProps) => (
  <div
    role="status"
    aria-label={label}
    className={cn(
      "grid min-h-dvh w-full place-items-center bg-background text-muted-foreground",
      className,
    )}
  >
    <div aria-hidden="true">
      <DotmLoading />
    </div>
  </div>
);
