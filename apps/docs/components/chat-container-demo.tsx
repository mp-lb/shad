"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatContainer } from "../../../registry/chat-container/chat-container";
import { ChatDateHeading } from "../../../registry/chat-container/chat-date-heading";

export function ChatContainerDemo() {
  const [messages, setMessages] = useState([
    "Welcome! Scroll up to pause following new messages.",
    "New messages follow automatically while you are at the bottom.",
  ]);
  return (
    <div className="flex h-80 flex-col overflow-hidden rounded-lg border">
      <ChatContainer
        role="log"
        aria-label="Example conversation"
        className="p-4"
        contentClassName="space-y-3"
      >
        <ChatDateHeading day="2026-01-01" label="Example conversation" />
        {messages.map((message, index) => (
          <p key={index} className="rounded-md bg-muted px-3 py-2 text-sm">
            {message}
          </p>
        ))}
      </ChatContainer>
      <div className="border-t p-3">
        <Button
          type="button"
          onClick={() =>
            setMessages((current) => [
              ...current,
              `New message ${current.length - 1}`,
            ])
          }
        >
          Add message
        </Button>
      </div>
    </div>
  );
}
