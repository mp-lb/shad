"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FullScreenCodeEntry } from "../../../registry/full-screen-code-entry/full-screen-code-entry";
import { FullScreenState } from "@/components/full-screen-state";

export function FullScreenCodeEntryDemo() {
  const [code, setCode] = useState("ABCD1234");
  const [approved, setApproved] = useState(false);
  return (
    <div className="overflow-hidden rounded-lg border">
      {approved ? (
        <FullScreenState className="min-h-80" title="CLI approved" description="You can return to your terminal." actions={<Button onClick={() => setApproved(false)}>Try again</Button>} />
      ) : (
        <FullScreenCodeEntry className="min-h-80" code={code} onCodeChange={setCode} onConfirm={() => setApproved(true)} />
      )}
    </div>
  );
}
