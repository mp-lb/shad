import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FullScreenStateProps = {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function FullScreenState({
  icon,
  title,
  description,
  actions,
  children,
  className,
}: FullScreenStateProps) {
  return (
    <main
      className={cn(
        "grid min-h-screen place-items-center bg-background p-6 text-foreground",
        className,
      )}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-3 text-center">
        {icon ? (
          <div className="text-muted-foreground" aria-hidden="true">
            {icon}
          </div>
        ) : null}
        {title ? <h1 className="text-base font-semibold">{title}</h1> : null}
        {description ? (
          <div className="text-sm text-muted-foreground">{description}</div>
        ) : null}
        {actions ? <div className="mt-2">{actions}</div> : null}
        {children}
      </div>
    </main>
  );
}
