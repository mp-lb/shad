"use client";

import * as React from "react";
import {
  Bot,
  FileText,
  FolderOpen,
  Globe2,
  Image,
  Plus,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

function AttachmentMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-foreground hover:bg-muted hover:text-foreground"
          aria-label="Attach"
        >
          <Plus className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-max min-w-40">
        <DropdownMenuItem>
          <FileText className="size-4" />
          Document
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Image className="size-4" />
          Image
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FolderOpen className="size-4" />
          Workspace file
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MessageInputDemo() {
  const [payload, setPayload] =
    React.useState<MessageInputSubmitPayload | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = React.useState(false);
  const previewPayload = payload
    ? { ...payload, webSearch: webSearchEnabled }
    : {
        text: "",
        entities: [],
        command: null,
        webSearch: webSearchEnabled,
      };

  return (
    <div className="grid gap-4">
      <MessageInput
        className="rounded-lg border shadow-sm"
        placeholder="Ask Orb to summarize @Ada or use /rewrite..."
        entities={entities}
        commands={commands}
        onSearchEntities={searchEntities}
        attachmentControl={<AttachmentMenu />}
        enableSpeechInput
        leadingActions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setWebSearchEnabled((current) => !current)}
            aria-pressed={webSearchEnabled}
            className={
              webSearchEnabled
                ? "h-8 rounded-full bg-blue-500/10 text-blue-700 hover:bg-blue-500/15 hover:text-blue-700 dark:bg-blue-400/15 dark:text-blue-300 dark:hover:bg-blue-400/20 dark:hover:text-blue-300"
                : "h-8 rounded-full text-foreground hover:bg-muted hover:text-foreground"
            }
          >
            <Globe2 className="size-4" />
            Web search
          </Button>
        }
        onSubmit={setPayload}
      />

      <div className="rounded-md border bg-muted/30 p-3">
        <div className="text-xs font-medium uppercase text-muted-foreground">
          Submit payload
        </div>
        <pre className="mt-2 overflow-auto text-xs">
          {JSON.stringify(previewPayload, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export const messageInputDemoCode = `"use client";

import * as React from "react";
import {
  Bot,
  FileText,
  FolderOpen,
  Globe2,
  Image,
  Plus,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageInput,
  type MessageInputCommand,
  type MessageInputEntity,
  type MessageInputSubmitPayload,
} from "@/components/message-input";

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

function AttachmentMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-foreground hover:bg-muted hover:text-foreground"
          aria-label="Attach"
        >
          <Plus className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-max min-w-40">
        <DropdownMenuItem>
          <FileText className="size-4" />
          Document
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Image className="size-4" />
          Image
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FolderOpen className="size-4" />
          Workspace file
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MessageInputDemo() {
  const [payload, setPayload] =
    React.useState<MessageInputSubmitPayload | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = React.useState(false);
  const previewPayload = payload
    ? { ...payload, webSearch: webSearchEnabled }
    : {
        text: "",
        entities: [],
        command: null,
        webSearch: webSearchEnabled,
      };

  return (
    <div className="grid gap-4">
      <MessageInput
        className="rounded-lg border shadow-sm"
        placeholder="Ask Orb to summarize @Ada or use /rewrite..."
        entities={entities}
        commands={commands}
        onSearchEntities={searchEntities}
        attachmentControl={<AttachmentMenu />}
        enableSpeechInput
        leadingActions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setWebSearchEnabled((current) => !current)}
            aria-pressed={webSearchEnabled}
            className={
              webSearchEnabled
                ? "h-8 rounded-full bg-blue-500/10 text-blue-700 hover:bg-blue-500/15 hover:text-blue-700 dark:bg-blue-400/15 dark:text-blue-300 dark:hover:bg-blue-400/20 dark:hover:text-blue-300"
                : "h-8 rounded-full text-foreground hover:bg-muted hover:text-foreground"
            }
          >
            <Globe2 className="size-4" />
            Web search
          </Button>
        }
        onSubmit={setPayload}
      />

      <div className="rounded-md border bg-muted/30 p-3">
        <div className="text-xs font-medium uppercase text-muted-foreground">
          Submit payload
        </div>
        <pre className="mt-2 overflow-auto text-xs">
          {JSON.stringify(previewPayload, null, 2)}
        </pre>
      </div>
    </div>
  );
}
`;
