"use client";

import {
  CircleAlert,
  Globe2,
  LoaderCircle,
  Monitor,
  WifiOff,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FrameProps = {
  title: string;
  description: ReactNode;
  icon: ReactNode;
  action?: ReactNode;
  className?: string;
};

function DesktopStateFrame({
  title,
  description,
  icon,
  action,
  className,
}: FrameProps) {
  return (
    <main
      className={cn(
        "grid min-h-48 place-items-center p-6 text-foreground",
        className,
      )}
    >
      <div
        className="flex w-full max-w-sm flex-col items-center gap-3 text-center"
        role="status"
      >
        <div className="text-muted-foreground" aria-hidden="true">
          {icon}
        </div>
        <h1 className="text-base font-semibold">{title}</h1>
        <div className="text-sm text-muted-foreground">{description}</div>
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </main>
  );
}

export function DesktopSignInState({
  onSignIn,
  phase = "idle",
  error,
  className,
}: {
  onSignIn: () => void;
  phase?: "idle" | "waiting" | "signing-in";
  error?: string | null;
  className?: string;
}) {
  return (
    <DesktopStateFrame
      className={className}
      title="Sign in"
      icon={
        phase === "signing-in" ? (
          <LoaderCircle className="size-6 animate-spin" />
        ) : (
          <Globe2 className="size-6" />
        )
      }
      description={
        <>
          {phase === "idle"
            ? "Continue in your browser to sign in."
            : phase === "waiting"
              ? "Finish signing in in your browser."
              : "Signing you in…"}
          {error ? (
            <p role="alert" className="mt-2 text-destructive">
              {error}
            </p>
          ) : null}
        </>
      }
      action={
        phase !== "signing-in" ? (
          <Button type="button" onClick={onSignIn}>
            {phase === "waiting" ? "Open browser again" : "Continue in browser"}
          </Button>
        ) : undefined
      }
    />
  );
}

export function DesktopAuthReturnState({
  onOpen,
  phase = "ready",
  className,
}: {
  onOpen: () => void;
  phase?: "working" | "ready" | "error";
  className?: string;
}) {
  return (
    <DesktopStateFrame
      className={className}
      title="Open the desktop app"
      icon={<Monitor className="size-6" />}
      description={
        phase === "working"
          ? "Getting your sign-in ready…"
          : phase === "error"
            ? "Could not open the app. Try again."
            : "Return to the app to finish signing in."
      }
      action={
        <Button type="button" onClick={onOpen} disabled={phase === "working"}>
          Open app
        </Button>
      }
    />
  );
}

export function DesktopOfflineState({
  onRetry,
  className,
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <DesktopStateFrame
      className={className}
      title="Could not connect"
      icon={<WifiOff className="size-6" />}
      description="Checking the connection again automatically."
      action={
        onRetry ? (
          <Button type="button" variant="outline" onClick={onRetry}>
            Retry now
          </Button>
        ) : undefined
      }
    />
  );
}

export function DesktopErrorState({
  onRetry,
  className,
  title = "Something went wrong",
  description = "Please try again.",
  retryLabel = "Try again",
  children,
}: {
  onRetry: () => void;
  className?: string;
  title?: string;
  description?: ReactNode;
  retryLabel?: string;
  children?: ReactNode;
}) {
  return (
    <DesktopStateFrame
      className={className}
      title={title}
      icon={<CircleAlert className="size-6" />}
      description={
        <>
          {description}
          {children}
        </>
      }
      action={
        <Button type="button" onClick={onRetry}>
          {retryLabel}
        </Button>
      }
    />
  );
}
