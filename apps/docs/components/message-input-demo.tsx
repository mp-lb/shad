"use client";

import * as React from "react";
import { Bot, FileText, Sparkles, Wand2 } from "lucide-react";

import {
  MessageInput,
  type MessageInputCommand,
  type MessageInputEntity,
  type MessageInputSubmitPayload,
} from "../../../registry/message-input/message-input";

const entities: MessageInputEntity[] = [
  {
    id: "ada",
    label: "Ada Lovelace",
    type: "user",
    description: "Product engineering",
  },
  {
    id: "grace",
    label: "Grace Hopper",
    type: "user",
    description: "Compiler systems",
  },
  {
    id: "orb",
    label: "Orb Assistant",
    type: "assistant",
    description: "AI project helper",
    icon: Bot,
  },
  {
    id: "brief",
    label: "Launch Brief",
    type: "document",
    description: "Shared planning document",
    icon: FileText,
  },
];

const commands: MessageInputCommand[] = [
  {
    id: "summarize",
    label: "Summarize",
    description: "Condense the current context.",
    icon: Sparkles,
  },
  {
    id: "rewrite",
    label: "Rewrite",
    description: "Improve tone and clarity.",
    icon: Wand2,
  },
];

function searchEntities(query: string): Promise<MessageInputEntity[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const normalizedQuery = query.toLowerCase();
      resolve(
        entities.filter((entity) =>
          [entity.label, entity.type, entity.description]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(normalizedQuery)),
        ),
      );
    }, 180);
  });
}

export function MessageInputDemo() {
  const [payload, setPayload] =
    React.useState<MessageInputSubmitPayload | null>(null);

  return (
    <div className="grid gap-4">
      <MessageInput
        placeholder="Ask Orb to summarize @Ada or use /rewrite..."
        entities={entities}
        commands={commands}
        onSearchEntities={searchEntities}
        onSubmit={setPayload}
      />

      <div className="rounded-md border bg-muted/30 p-3">
        <div className="text-xs font-medium uppercase text-muted-foreground">
          Submit payload
        </div>
        <pre className="mt-2 overflow-auto text-xs">
          {JSON.stringify(
            payload ?? { text: "", entities: [], command: null },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}
