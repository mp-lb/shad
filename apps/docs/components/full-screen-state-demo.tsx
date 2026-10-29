"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { FullScreenState } from "../../../registry/full-screen-state/full-screen-state";

export function FullScreenStateDemo() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = useId();

  return (
    <div className="rounded-lg border">
      <FullScreenState
        className="min-h-64"
        title="Something needs attention"
        description="You can try again or view more information."
        actions={
          <>
            <Button type="button" onClick={() => setDetailsOpen(false)}>
              Try again
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-expanded={detailsOpen}
              aria-controls={detailsId}
              onClick={() => setDetailsOpen((open) => !open)}
            >
              {detailsOpen ? "Hide details" : "View details"}
            </Button>
          </>
        }
      >
        <div
          id={detailsId}
          hidden={!detailsOpen}
          className="w-full rounded-md border bg-muted p-3 text-left text-sm text-muted-foreground"
        >
          Example details provided by the application.
        </div>
      </FullScreenState>
    </div>
  );
}
