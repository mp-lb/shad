"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  MapLabLoader,
  RetryErrorState,
  StateLayout,
  SuccessState,
} from "../../../registry/ui-states/ui-states";

export function UiStatesDemo() {
  const [retryCount, setRetryCount] = React.useState(0);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-4 rounded-lg border p-4">
        <MapLabLoader size="sm" />
        <MapLabLoader />
        <MapLabLoader size="lg" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border">
          <LoadingState label="Loading workspace" />
        </div>
        <div className="rounded-lg border">
          <EmptyState
            title="No saved views"
            description="Create a saved view when you want to return to the same filtered list."
            action={<Button variant="outline">Create view</Button>}
          />
        </div>
        <div className="rounded-lg border">
          <RetryErrorState
            title="Could not load activity"
            description={
              retryCount === 0
                ? "The request failed before any rows were returned."
                : `Retry requested ${retryCount} time${
                    retryCount === 1 ? "" : "s"
                  }.`
            }
            onRetry={() => setRetryCount((count) => count + 1)}
          />
        </div>
        <div className="rounded-lg border">
          <SuccessState
            title="Sync complete"
            description="All local changes have been saved."
          />
        </div>
      </div>

      <div className="grid gap-3">
        <StateLayout
          presentation="inline"
          title="Background refresh running"
          description="You can keep working while this finishes."
        />
        <ErrorState
          presentation="inline"
          title="Import failed"
          description="Check the file and try again."
        />
      </div>
    </div>
  );
}
