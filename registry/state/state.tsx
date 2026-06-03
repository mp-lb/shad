"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Inbox,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StateTone = "default" | "destructive" | "success";
type StatePresentation = "centered" | "inline";
type LoaderSize = "sm" | "md" | "lg";

const stateToneIconClasses: Record<StateTone, string> = {
  default: "text-muted-foreground",
  destructive: "text-destructive",
  success: "text-emerald-500",
};

const inlineToneClasses: Record<StateTone, string> = {
  default: "border-border bg-muted/30",
  destructive: "border-destructive/30 bg-destructive/10",
  success: "border-emerald-500/30 bg-emerald-500/10",
};

const loaderSizeClasses: Record<LoaderSize, string> = {
  sm: "size-5 gap-0.5",
  md: "size-7 gap-1",
  lg: "size-10 gap-1.5",
};

const loaderDotClasses: Record<LoaderSize, string> = {
  sm: "size-1",
  md: "size-1.5",
  lg: "size-2",
};

export function MapLabLoader({
  "aria-label": ariaLabel = "Loading",
  className,
  size = "md",
}: {
  "aria-label"?: string;
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <span
      aria-label={ariaLabel}
      className={cn(
        "grid grid-cols-3 place-items-center text-primary",
        loaderSizeClasses[size],
        className,
      )}
      role="status"
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <span
          aria-hidden="true"
          className={cn(
            "rounded-full bg-current motion-safe:animate-pulse",
            loaderDotClasses[size],
          )}
          key={index}
          style={{ animationDelay: `${index * 85}ms` }}
        />
      ))}
    </span>
  );
}

export function StateLayout({
  action,
  className,
  containerClassName,
  description,
  icon: Icon = Info,
  presentation = "centered",
  title,
  tone = "default",
}: {
  action?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
  presentation?: StatePresentation;
  title: React.ReactNode;
  tone?: StateTone;
}) {
  const content = (
    <div
      className={cn(
        presentation === "inline"
          ? "flex items-start gap-3 rounded-lg border p-4 text-sm"
          : "flex max-w-md flex-col items-center gap-3 text-center text-sm",
        presentation === "inline" && inlineToneClasses[tone],
        className,
      )}
    >
      <Icon
        className={cn(
          presentation === "inline" ? "mt-0.5 size-4 shrink-0" : "size-6",
          stateToneIconClasses[tone],
        )}
      />
      <div>
        <p
          className={cn(
            "font-medium",
            tone === "destructive" && "text-destructive",
          )}
        >
          {title}
        </p>
        {description ? (
          <p
            className={cn(
              "mt-1 text-muted-foreground",
              presentation === "centered" && "max-w-sm",
            )}
          >
            {description}
          </p>
        ) : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );

  if (presentation === "inline") {
    return content;
  }

  return (
    <div
      className={cn("grid min-h-40 place-items-center p-6", containerClassName)}
    >
      {content}
    </div>
  );
}

export function EmptyState({
  action,
  className,
  containerClassName,
  description = "Nothing to show.",
  icon = Inbox,
  title,
}: {
  action?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
  title: React.ReactNode;
}) {
  return (
    <StateLayout
      action={action}
      className={className}
      containerClassName={containerClassName}
      description={description}
      icon={icon}
      title={title}
    />
  );
}

export function ErrorState({
  action,
  className,
  containerClassName,
  description,
  icon = AlertCircle,
  presentation,
  title = "Could not load data",
}: {
  action?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
  presentation?: StatePresentation;
  title?: React.ReactNode;
}) {
  return (
    <StateLayout
      action={action}
      className={className}
      containerClassName={containerClassName}
      description={description}
      icon={icon}
      presentation={presentation}
      title={title}
      tone="destructive"
    />
  );
}

export function RetryErrorState({
  description,
  onRetry,
  title,
}: {
  description?: React.ReactNode;
  onRetry: () => void;
  title?: React.ReactNode;
}) {
  return (
    <ErrorState
      action={
        <Button onClick={onRetry} type="button" variant="outline">
          Retry
        </Button>
      }
      description={description}
      title={title}
    />
  );
}

export function SuccessState({
  action,
  className,
  containerClassName,
  description,
  icon = CheckCircle2,
  presentation,
  title,
}: {
  action?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
  presentation?: StatePresentation;
  title: React.ReactNode;
}) {
  return (
    <StateLayout
      action={action}
      className={className}
      containerClassName={containerClassName}
      description={description}
      icon={icon}
      presentation={presentation}
      title={title}
      tone="success"
    />
  );
}

export function LoadingState({
  className,
  containerClassName,
  label = "Loading",
  size = "md",
}: {
  className?: string;
  containerClassName?: string;
  label?: string;
  size?: LoaderSize;
}) {
  return (
    <div
      className={cn(
        "grid min-h-40 place-items-center p-6 text-muted-foreground",
        containerClassName,
      )}
    >
      <div
        className={cn("flex flex-col items-center gap-3 text-sm", className)}
      >
        <MapLabLoader aria-label={label} size={size} />
        {label ? <p>{label}</p> : null}
      </div>
    </div>
  );
}
