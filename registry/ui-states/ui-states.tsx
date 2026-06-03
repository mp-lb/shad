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

import { DotmLoading } from "./dotm-loading";

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

const loaderSizes: Record<LoaderSize, number> = {
  sm: 16,
  md: 22,
  lg: 32,
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
    <DotmLoading
      aria-label={ariaLabel}
      className={cn("shrink-0 text-primary", className)}
      dotSize={size === "lg" ? 3 : 2}
      size={loaderSizes[size]}
    />
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
