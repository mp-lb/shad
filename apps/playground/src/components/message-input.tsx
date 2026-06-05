"use client";

import * as React from "react";
import {
  Bot,
  CornerDownLeft,
  FileText,
  Hash,
  Loader2,
  Paperclip,
  Send,
  Slash,
  Sparkles,
  User,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type MessageInputEntity = {
  id: string;
  label: string;
  type?: string;
  description?: string;
  avatarUrl?: string;
  icon?: LucideIcon;
};

export type MessageInputCommand = {
  id: string;
  label: string;
  description?: string;
  value?: string;
  icon?: LucideIcon;
};

export type MessageInputSubmitPayload = {
  text: string;
  entities: MessageInputEntity[];
  command: MessageInputCommand | null;
};

export type MessageInputProps = Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "onChange"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  entities?: MessageInputEntity[];
  commands?: MessageInputCommand[];
  onSearchEntities?: (query: string) =>
    | MessageInputEntity[]
    | Promise<MessageInputEntity[]>;
  onSearchCommands?: (query: string) =>
    | MessageInputCommand[]
    | Promise<MessageInputCommand[]>;
  onEntitySelect?: (entity: MessageInputEntity) => void;
  onCommandSelect?: (command: MessageInputCommand | null) => void;
  onSubmit?: (payload: MessageInputSubmitPayload) => void;
  onAttachmentClick?: () => void;
  submitLabel?: string;
  attachmentLabel?: string;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
};

type TriggerKind = "entity" | "command";

type ActiveTrigger = {
  kind: TriggerKind;
  query: string;
  startIndex: number;
  endIndex: number;
};

type Suggestion =
  | {
      kind: "entity";
      item: MessageInputEntity;
    }
  | {
      kind: "command";
      item: MessageInputCommand;
    };

function useControllableValue({
  value,
  defaultValue = "",
  onValueChange,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  return [currentValue, setValue] as const;
}

function getActiveTrigger(text: string, cursorPosition: number): ActiveTrigger | null {
  const beforeCursor = text.slice(0, cursorPosition);
  const tokenMatch = /(^|[\s([{])([@/])([^\s@/]*)$/.exec(beforeCursor);

  if (!tokenMatch) {
    return null;
  }

  const prefix = tokenMatch[1] ?? "";
  const trigger = tokenMatch[2];
  const query = tokenMatch[3] ?? "";
  const startIndex = tokenMatch.index + prefix.length;

  if (trigger === "/" && prefix !== "" && !beforeCursor.slice(0, startIndex).trim()) {
    return null;
  }

  return {
    kind: trigger === "@" ? "entity" : "command",
    query,
    startIndex,
    endIndex: cursorPosition,
  };
}

function getEntityIcon(entity: MessageInputEntity): LucideIcon {
  if (entity.icon) return entity.icon;
  if (entity.type === "bot" || entity.type === "assistant") return Bot;
  if (entity.type === "file" || entity.type === "document") return FileText;
  if (entity.type === "topic" || entity.type === "channel") return Hash;
  return User;
}

function getInitials(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function filterEntities(items: MessageInputEntity[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) =>
    [item.label, item.description, item.type]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedQuery)),
  );
}

function filterCommands(items: MessageInputCommand[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) =>
    [item.label, item.description, item.value]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedQuery)),
  );
}

function insertSuggestionText({
  text,
  trigger,
  replacement,
}: {
  text: string;
  trigger: ActiveTrigger;
  replacement: string;
}) {
  const before = text.slice(0, trigger.startIndex);
  const after = text.slice(trigger.endIndex);
  const spacer = after.startsWith(" ") || after.length === 0 ? "" : " ";
  const nextText = `${before}${replacement} ${spacer}${after}`;
  const nextCursor = before.length + replacement.length + 1;

  return { nextText, nextCursor };
}

function SuggestionIcon({ suggestion }: { suggestion: Suggestion }) {
  if (suggestion.kind === "command") {
    const Icon = suggestion.item.icon ?? Slash;
    return (
      <div className="grid size-8 shrink-0 place-items-center rounded-md border bg-muted/40 text-muted-foreground">
        <Icon className="size-4" />
      </div>
    );
  }

  const Icon = getEntityIcon(suggestion.item);

  if (suggestion.item.avatarUrl) {
    return (
      <img
        alt=""
        src={suggestion.item.avatarUrl}
        className="size-8 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="grid size-8 shrink-0 place-items-center rounded-full border bg-muted/50 text-xs font-medium text-muted-foreground">
      {suggestion.item.type === "user" || !suggestion.item.type ? (
        getInitials(suggestion.item.label) || <Icon className="size-4" />
      ) : (
        <Icon className="size-4" />
      )}
    </div>
  );
}

function SuggestionsList({
  activeIndex,
  id,
  isLoading,
  query,
  suggestions,
  triggerKind,
  onSelect,
}: {
  activeIndex: number;
  id: string;
  isLoading: boolean;
  query: string;
  suggestions: Suggestion[];
  triggerKind: TriggerKind;
  onSelect: (suggestion: Suggestion) => void;
}) {
  const title = triggerKind === "entity" ? "Mention" : "Command";

  return (
    <div
      id={id}
      role="listbox"
      className="absolute right-0 bottom-full left-0 z-20 mb-2 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg"
    >
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="text-xs font-medium text-muted-foreground">
          {title}
          {query ? <span className="font-normal"> matching "{query}"</span> : null}
        </div>
        {isLoading ? (
          <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
        ) : null}
      </div>
      <div className="max-h-72 overflow-y-auto p-1">
        {suggestions.length === 0 ? (
          <div className="grid place-items-center px-3 py-8 text-sm text-muted-foreground">
            {isLoading ? "Searching..." : "No results"}
          </div>
        ) : (
          suggestions.map((suggestion, index) => {
            const item = suggestion.item;
            const selected = index === activeIndex;

            return (
              <button
                key={`${suggestion.kind}-${item.id}`}
                type="button"
                role="option"
                aria-selected={selected}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(suggestion)}
                className={cn(
                  "flex w-full min-w-0 items-center gap-3 rounded-md px-2 py-2 text-left text-sm outline-none",
                  selected
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/70 hover:text-accent-foreground",
                )}
              >
                <SuggestionIcon suggestion={suggestion} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium">{item.label}</span>
                    {"type" in item && item.type ? (
                      <span className="rounded-sm border px-1 py-0 text-[10px] uppercase text-muted-foreground">
                        {item.type}
                      </span>
                    ) : null}
                  </span>
                  {item.description ? (
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export function MessageInput({
  attachmentLabel = "Attach",
  className,
  commands = [],
  defaultValue,
  disabled = false,
  entities = [],
  isSubmitting = false,
  maxLength = 4000,
  maxRows = 8,
  minRows = 2,
  onAttachmentClick,
  onCommandSelect,
  onEntitySelect,
  onSearchCommands,
  onSearchEntities,
  onSubmit,
  onValueChange,
  placeholder = "Ask anything...",
  submitLabel = "Send",
  value,
  ...props
}: MessageInputProps) {
  const listId = React.useId();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const searchRequestRef = React.useRef(0);
  const [text, setText] = useControllableValue({
    value,
    defaultValue,
    onValueChange,
  });
  const [activeTrigger, setActiveTrigger] = React.useState<ActiveTrigger | null>(
    null,
  );
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedEntities, setSelectedEntities] = React.useState<
    MessageInputEntity[]
  >([]);
  const [selectedCommand, setSelectedCommand] =
    React.useState<MessageInputCommand | null>(null);

  const canSubmit = text.trim().length > 0 && !disabled && !isSubmitting;
  const showSuggestions = Boolean(activeTrigger);

  const refreshTrigger = React.useCallback((nextText: string) => {
    const input = textareaRef.current;
    const cursor = input?.selectionStart ?? nextText.length;
    setActiveTrigger(getActiveTrigger(nextText, cursor));
  }, []);

  React.useEffect(() => {
    if (!activeTrigger) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const trigger = activeTrigger;
    let isCurrent = true;
    const requestId = searchRequestRef.current + 1;
    searchRequestRef.current = requestId;
    setSelectedIndex(0);
    setIsSearching(true);

    async function search() {
      try {
        if (trigger.kind === "entity") {
          const results = onSearchEntities
            ? await onSearchEntities(trigger.query)
            : filterEntities(entities, trigger.query);

          if (isCurrent && searchRequestRef.current === requestId) {
            setSuggestions(results.slice(0, 8).map((item) => ({ kind: "entity", item })));
          }
          return;
        }

        const results = onSearchCommands
          ? await onSearchCommands(trigger.query)
          : filterCommands(commands, trigger.query);

        if (isCurrent && searchRequestRef.current === requestId) {
          setSuggestions(results.slice(0, 8).map((item) => ({ kind: "command", item })));
        }
      } finally {
        if (isCurrent && searchRequestRef.current === requestId) {
          setIsSearching(false);
        }
      }
    }

    const timeoutId = window.setTimeout(search, 120);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeoutId);
    };
  }, [
    activeTrigger,
    commands,
    entities,
    onSearchCommands,
    onSearchEntities,
  ]);

  const selectSuggestion = React.useCallback(
    (suggestion: Suggestion) => {
      if (!activeTrigger) return;

      if (suggestion.kind === "entity") {
        const { nextText, nextCursor } = insertSuggestionText({
          text,
          trigger: activeTrigger,
          replacement: `@${suggestion.item.label}`,
        });

        setText(nextText);
        setSelectedEntities((current) => {
          const withoutDuplicate = current.filter(
            (item) => item.id !== suggestion.item.id,
          );
          return [...withoutDuplicate, suggestion.item];
        });
        onEntitySelect?.(suggestion.item);
        setActiveTrigger(null);

        window.setTimeout(() => {
          textareaRef.current?.focus();
          textareaRef.current?.setSelectionRange(nextCursor, nextCursor);
        }, 0);
        return;
      }

      const { nextText, nextCursor } = insertSuggestionText({
        text,
        trigger: activeTrigger,
        replacement: "",
      });

      setText(nextText.trimStart());
      setSelectedCommand(suggestion.item);
      onCommandSelect?.(suggestion.item);
      setActiveTrigger(null);

      window.setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(
          Math.max(0, nextCursor - 1),
          Math.max(0, nextCursor - 1),
        );
      }, 0);
    },
    [
      activeTrigger,
      onCommandSelect,
      onEntitySelect,
      setText,
      text,
    ],
  );

  function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const nextText = event.target.value;
    setText(nextText);
    window.requestAnimationFrame(() => refreshTrigger(nextText));
  }

  function submit() {
    if (!canSubmit) return;

    onSubmit?.({
      text: text.trim(),
      entities: selectedEntities.filter((entity) =>
        text.toLowerCase().includes(`@${entity.label.toLowerCase()}`),
      ),
      command: selectedCommand,
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (showSuggestions && suggestions.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((current) => (current + 1) % suggestions.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex(
          (current) => (current - 1 + suggestions.length) % suggestions.length,
        );
        return;
      }

      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        selectSuggestion(suggestions[selectedIndex]);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setActiveTrigger(null);
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  const rows = Math.min(
    maxRows,
    Math.max(minRows, text.split("\n").length || minRows),
  );

  return (
    <form
      data-slot="message-input"
      className={cn("relative", className)}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      {...props}
    >
      {showSuggestions ? (
        <SuggestionsList
          activeIndex={selectedIndex}
          id={listId}
          isLoading={isSearching}
          query={activeTrigger?.query ?? ""}
          suggestions={suggestions}
          triggerKind={activeTrigger?.kind ?? "entity"}
          onSelect={selectSuggestion}
        />
      ) : null}

      <div
        className={cn(
          "rounded-2xl border bg-background shadow-sm transition-colors",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20",
          disabled && "opacity-60",
        )}
      >
        {selectedCommand ? (
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <div className="flex min-w-0 items-center gap-2 rounded-full border bg-muted/40 px-2.5 py-1 text-xs">
              <Sparkles className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate font-medium">{selectedCommand.label}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCommand(null);
                  onCommandSelect?.(null);
                }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Clear command"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ) : null}

        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onClick={() => refreshTrigger(text)}
          onKeyUp={() => refreshTrigger(text)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          aria-controls={showSuggestions ? listId : undefined}
          aria-expanded={showSuggestions}
          className={cn(
            "max-h-64 min-h-0 resize-none rounded-2xl border-0 bg-transparent px-4 py-3 shadow-none",
            "focus-visible:ring-0",
          )}
        />

        <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {onAttachmentClick ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onAttachmentClick}
                disabled={disabled}
                aria-label={attachmentLabel}
              >
                <Paperclip className="size-4" />
              </Button>
            ) : null}
            <span className="hidden sm:inline">
              <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">
                @
              </kbd>{" "}
              mention
              {commands.length > 0 || onSearchCommands ? (
                <>
                  {" "}
                  ·{" "}
                  <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">
                    /
                  </kbd>{" "}
                  command
                </>
              ) : null}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
              <CornerDownLeft className="size-3.5" />
              Send
            </span>
            <Button
              type="submit"
              size="icon"
              disabled={!canSubmit}
              aria-label={submitLabel}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
