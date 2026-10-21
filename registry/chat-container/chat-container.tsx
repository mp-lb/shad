"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ChatContainerProps = React.ComponentProps<"div"> & {
  contentClassName?: string;
  rootClassName?: string;
};

/** A chat viewport that follows new content until the reader scrolls away. */
export function ChatContainer({
  children,
  className,
  contentClassName,
  onKeyDownCapture,
  onPointerDownCapture,
  onPointerMoveCapture,
  onScroll,
  onTouchMoveCapture,
  onWheelCapture,
  rootClassName,
  ...props
}: ChatContainerProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const followingRef = React.useRef(true);
  const previousScrollTopRef = React.useRef(0);
  const lastUserScrollIntentRef = React.useRef(-Infinity);
  const [awayFromBottom, setAwayFromBottom] = React.useState(false);

  const scrollToBottom = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
    previousScrollTopRef.current = viewport.scrollTop;
    followingRef.current = true;
    lastUserScrollIntentRef.current = -Infinity;
    setAwayFromBottom(false);
  }, []);

  const syncScroll = React.useCallback((userInitiated = false) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const distance = viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop;
    if (distance <= 24) {
      followingRef.current = true;
      lastUserScrollIntentRef.current = -Infinity;
      setAwayFromBottom(false);
    } else if (userInitiated && viewport.scrollTop < previousScrollTopRef.current - 1) {
      followingRef.current = false;
      setAwayFromBottom(true);
    } else if (followingRef.current) {
      scrollToBottom();
    } else {
      setAwayFromBottom(true);
    }
    previousScrollTopRef.current = viewport.scrollTop;
  }, [scrollToBottom]);

  React.useLayoutEffect(() => {
    if (followingRef.current) scrollToBottom();
    else syncScroll();
  });

  React.useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => syncScroll());
    if (contentRef.current) observer.observe(contentRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [syncScroll]);

  return (
    <div data-slot="chat-container" className={cn("relative min-h-0 flex-1", rootClassName)}>
      <div
        ref={viewportRef}
        data-slot="chat-container-viewport"
        className={cn("h-full overflow-y-auto", className)}
        tabIndex={0}
        onWheelCapture={(event) => {
          lastUserScrollIntentRef.current = performance.now();
          onWheelCapture?.(event);
        }}
        onTouchMoveCapture={(event) => {
          lastUserScrollIntentRef.current = performance.now();
          onTouchMoveCapture?.(event);
        }}
        onPointerDownCapture={(event) => {
          lastUserScrollIntentRef.current = performance.now();
          onPointerDownCapture?.(event);
        }}
        onPointerMoveCapture={(event) => {
          if (event.buttons) lastUserScrollIntentRef.current = performance.now();
          onPointerMoveCapture?.(event);
        }}
        onKeyDownCapture={(event) => {
          if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
            lastUserScrollIntentRef.current = performance.now();
          }
          onKeyDownCapture?.(event);
        }}
        onScroll={(event) => {
          syncScroll(performance.now() - lastUserScrollIntentRef.current < 200);
          onScroll?.(event);
        }}
        {...props}
      >
        <div ref={contentRef} className={cn(contentClassName)}>{children}</div>
      </div>
      {awayFromBottom && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 border border-border shadow-sm"
          onClick={scrollToBottom}
        >
          <ArrowDown aria-hidden="true" />
          Jump to latest
        </Button>
      )}
    </div>
  );
}
