import { Button } from "@/components/ui/button";
import { FullScreenState } from "../../../registry/full-screen-state/full-screen-state";

export function FullScreenStateDemo() {
  return (
    <div className="rounded-lg border">
      <FullScreenState
        className="min-h-64"
        title="Nothing here yet"
        description="Your content will appear here."
        actions={<Button type="button">Create item</Button>}
      />
    </div>
  );
}
