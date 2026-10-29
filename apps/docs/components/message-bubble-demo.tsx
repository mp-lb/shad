import { MessageBubble } from "../../../registry/message-bubble/message-bubble";
import { MessageBubbleResponding } from "../../../registry/message-bubble/message-bubble-responding";

export function MessageBubbleDemo() {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      <MessageBubble side="incoming" label="Alex">
        Can you share the latest update?
      </MessageBubble>
      <MessageBubble side="outgoing" label="You">
        Yes — the changes are ready to review.
      </MessageBubble>
      <MessageBubbleResponding label="Alex" />
    </div>
  );
}
