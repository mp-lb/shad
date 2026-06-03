"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  AlertModal,
  FullscreenModal,
  StandardModal,
} from "../../../registry/modal/modal";

const galleryItems = [
  "Store preview",
  "Canvas detail",
  "Document view",
  "Asset metadata",
  "Revision notes",
  "Export checks",
];

export function ModalDemo() {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [standardOpen, setStandardOpen] = React.useState(false);
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => setAlertOpen(true)}>
        Alert
      </Button>
      <Button variant="outline" onClick={() => setStandardOpen(true)}>
        Standard
      </Button>
      <Button variant="outline" onClick={() => setFullscreenOpen(true)}>
        Fullscreen
      </Button>

      <AlertModal
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Delete saved view?"
        description="This removes the saved layout for everyone using this workspace."
        cancelLabel="Cancel"
        actionLabel="Delete"
        actionVariant="destructive"
      />

      <StandardModal
        open={standardOpen}
        onOpenChange={setStandardOpen}
        title="Project settings"
        description="A fixed header and footer frame around arbitrary modal content."
        footer={
          <>
            <Button variant="outline" onClick={() => setStandardOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setStandardOpen(false)}>Save</Button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="rounded-md border bg-muted/30 p-4">
            <h3 className="text-sm font-medium">Pinned order</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Medium-width modals are suited to focused workflows with a clear
              action footer.
            </p>
          </div>
          <div className="grid gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="rounded-md border px-3 py-2 text-sm text-muted-foreground"
              >
                Scrollable setting row {index + 1}
              </div>
            ))}
          </div>
        </div>
      </StandardModal>

      <FullscreenModal
        open={fullscreenOpen}
        onOpenChange={setFullscreenOpen}
        title="Gallery"
        description="Use this when the user needs maximum room without fully leaving context."
        footer={
          <Button variant="outline" onClick={() => setFullscreenOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <div
              key={item}
              className="flex aspect-video items-end rounded-md border bg-muted/40 p-4"
            >
              <div>
                <div className="text-sm font-medium">{item}</div>
                <div className="text-xs text-muted-foreground">
                  Frame {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </FullscreenModal>
    </div>
  );
}
