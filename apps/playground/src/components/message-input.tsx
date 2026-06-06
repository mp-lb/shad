"use client";

import * as React from "react";
import {
  Extension,
  mergeAttributes,
  Node,
  type Editor,
  type JSONContent,
} from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowUp,
  Bot,
  FileText,
  Hash,
  Loader2,
  Mic,
  Plus,
  Slash,
  Sparkles,
  Square,
  User,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MessageInputEntity = {
  id: string;
  label: string;
  type?: string;
  description?: string;
  avatarUrl?: string;
  icon?: LucideIcon;
  color?: "blue" | "violet" | "amber" | "rose" | "emerald";
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
  content: JSONContent;
};

export type MessageInputProps = Omit<
  React.ComponentProps<"form">,
  "className" | "onSubmit" | "onChange"
> & {
  value?: JSONContent;
  defaultValue?: JSONContent | string;
  onValueChange?: (content: JSONContent, text: string) => void;
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
  attachmentControl?: React.ReactNode;
  leadingActions?: React.ReactNode;
  trailingActions?: React.ReactNode;
  suggestionsPlacement?: "auto" | "top" | "bottom";
  className?: string;
  rootClassName?: string;
  composerClassName?: string;
  editorClassName?: string;
  toolbarClassName?: string;
  submitLabel?: string;
  attachmentLabel?: string;
  enableSpeechInput?: boolean;
  speechInputLabel?: string;
  speechRecognitionLang?: string;
  minHeight?: number;
};

type TriggerKind = "entity" | "command";

type ActiveTrigger = {
  kind: TriggerKind;
  query: string;
  from: number;
  to: number;
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

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionResultEvent = {
  results: ArrayLike<{
    0?: {
      transcript?: string;
    };
  }>;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

const defaultContent: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const MessageInputMention = Node.create({
  name: "messageInputMention",
  group: "inline",
  inline: true,
  atom: true,
  selectable: false,

  addAttributes() {
    return {
      id: { default: "" },
      label: { default: "" },
      type: { default: "user" },
      color: { default: "blue" },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-message-input-mention]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-message-input-mention": "",
        class: cn(
          "inline-flex items-center rounded-full px-1.5 py-0.5 text-sm font-semibold leading-none",
          getMentionColorClassName(String(HTMLAttributes.color ?? "blue")),
        ),
      }),
      `@${HTMLAttributes.label}`,
    ];
  },

  renderText({ node }) {
    return `@${node.attrs.label}`;
  },
});

function getMentionColorClassName(color: string) {
  switch (color) {
    case "amber":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
    case "emerald":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    case "rose":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-300";
    case "violet":
      return "bg-violet-500/10 text-violet-700 dark:text-violet-300";
    default:
      return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
  }
}

function getEntityColor(entity: MessageInputEntity) {
  if (entity.color) return entity.color;
  if (entity.type === "file" || entity.type === "document") return "amber";
  if (entity.type === "bot" || entity.type === "assistant") return "violet";
  if (entity.type === "error" || entity.type === "danger") return "rose";
  return "blue";
}

function normalizeContent(value?: JSONContent | string): JSONContent {
  if (!value) return defaultContent;
  if (typeof value !== "string") return value;

  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: value ? [{ type: "text", text: value }] : undefined,
      },
    ],
  };
}

function getTextFromContent(content: JSONContent): string {
  if (content.type === "text") return content.text ?? "";
  if (content.type === "messageInputMention") {
    return `@${String(content.attrs?.label ?? "")}`;
  }
  if (content.type === "hardBreak") return "\n";

  return (content.content ?? []).map(getTextFromContent).join("");
}

function getEntitiesFromContent(
  content: JSONContent,
  entities: MessageInputEntity[],
): MessageInputEntity[] {
  const byId = new Map(entities.map((entity) => [entity.id, entity]));
  const found = new Map<string, MessageInputEntity>();

  function visit(node: JSONContent) {
    if (node.type === "messageInputMention") {
      const id = String(node.attrs?.id ?? "");
      const fallback: MessageInputEntity = {
        id,
        label: String(node.attrs?.label ?? ""),
        type: String(node.attrs?.type ?? "user"),
        color: String(node.attrs?.color ?? "blue") as MessageInputEntity["color"],
      };
      found.set(id, byId.get(id) ?? fallback);
    }

    node.content?.forEach(visit);
  }

  visit(content);
  return [...found.values()];
}

function getActiveTriggerFromEditor(editor: NonNullable<ReturnType<typeof useEditor>>): ActiveTrigger | null {
  const { from } = editor.state.selection;
  const beforeCursor = editor.state.doc.textBetween(
    Math.max(0, from - 80),
    from,
    "\n",
    "\n",
  );
  const tokenMatch = /(^|[\s([{])([@/])([^\s@/]*)$/.exec(beforeCursor);

  if (!tokenMatch) return null;

  const prefix = tokenMatch[1] ?? "";
  const trigger = tokenMatch[2];
  const query = tokenMatch[3] ?? "";
  const tokenLength = trigger.length + query.length;
  const triggerFrom = from - tokenLength;

  if (trigger === "/" && prefix !== "" && beforeCursor.slice(0, tokenMatch.index + prefix.length).trim()) {
    return null;
  }

  return {
    kind: trigger === "@" ? "entity" : "command",
    query,
    from: triggerFrom,
    to: from,
  };
}

function getLineRange(editor: Editor) {
  const { from } = editor.state.selection;
  const docStart = Math.max(0, from - 10000);
  const beforeCursor = editor.state.doc.textBetween(docStart, from, "\n", "\n");
  const afterCursor = editor.state.doc.textBetween(
    from,
    editor.state.doc.content.size,
    "\n",
    "\n",
  );
  const previousBreakIndex = beforeCursor.lastIndexOf("\n");
  const nextBreakIndex = afterCursor.indexOf("\n");

  return {
    from:
      previousBreakIndex === -1
        ? from - beforeCursor.length
        : from - (beforeCursor.length - previousBreakIndex - 1),
    to: nextBreakIndex === -1 ? from + afterCursor.length : from + nextBreakIndex,
  };
}

function getPreviousWordRange(editor: Editor) {
  const { from } = editor.state.selection;
  const beforeCursor = editor.state.doc.textBetween(
    Math.max(0, from - 10000),
    from,
    "\n",
    "\n",
  );
  const trailingWhitespaceLength = beforeCursor.match(/\s+$/)?.[0].length ?? 0;
  const withoutTrailingWhitespace = beforeCursor.slice(
    0,
    beforeCursor.length - trailingWhitespaceLength,
  );
  const previousWordLength = withoutTrailingWhitespace.match(/\S+$/)?.[0].length ?? 0;
  const deleteLength = trailingWhitespaceLength + previousWordLength;

  if (deleteLength === 0) return null;

  return {
    from: from - deleteLength,
    to: from,
  };
}

function deletePreviousWord(editor: Editor) {
  const selection = editor.state.selection;
  const hasSelection = selection.from !== selection.to;

  const range = hasSelection
    ? { from: selection.from, to: selection.to }
    : getPreviousWordRange(editor);
  if (range) {
    editor.chain().focus().deleteRange(range).run();
  }
  return true;
}

function deleteToLineStart(editor: Editor) {
  const selection = editor.state.selection;
  const hasSelection = selection.from !== selection.to;
  const lineRange = getLineRange(editor);
  const range = hasSelection
    ? { from: selection.from, to: selection.to }
    : { from: lineRange.from, to: selection.from };
  if (range.from !== range.to) {
    editor.chain().focus().deleteRange(range).run();
  }
  return true;
}

function deleteToLineEnd(editor: Editor) {
  const selection = editor.state.selection;
  const hasSelection = selection.from !== selection.to;
  const lineRange = getLineRange(editor);
  const to =
    !hasSelection && selection.from === lineRange.to
      ? Math.min(editor.state.doc.content.size, lineRange.to + 1)
      : lineRange.to;
  const range = hasSelection
    ? { from: selection.from, to: selection.to }
    : { from: selection.from, to };
  if (range.from !== range.to) {
    editor.chain().focus().deleteRange(range).run();
  }
  return true;
}

function moveToLineStart(editor: Editor) {
  editor.chain().focus().setTextSelection(getLineRange(editor).from).run();
  return true;
}

function moveToLineEnd(editor: Editor) {
  editor.chain().focus().setTextSelection(getLineRange(editor).to).run();
  return true;
}

function handleMacOSShortcut(editor: Editor, event: KeyboardEvent) {
  if (event.altKey && event.key === "Backspace") {
    event.preventDefault();
    return deletePreviousWord(editor);
  }

  if (event.metaKey && event.key === "Backspace") {
    event.preventDefault();
    return deleteToLineStart(editor);
  }

  if (event.ctrlKey && event.key.toLowerCase() === "k") {
    event.preventDefault();
    return deleteToLineEnd(editor);
  }

  if (event.metaKey && !event.shiftKey && event.key === "ArrowLeft") {
    event.preventDefault();
    return moveToLineStart(editor);
  }

  if (event.metaKey && !event.shiftKey && event.key === "ArrowRight") {
    event.preventDefault();
    return moveToLineEnd(editor);
  }

  return false;
}

const MessageInputMacOSShortcuts = Extension.create({
  name: "messageInputMacOSShortcuts",
  priority: 1000,

  addKeyboardShortcuts() {
    return {
      "Alt-Backspace": () => deletePreviousWord(this.editor),
      "Mod-Backspace": () => deleteToLineStart(this.editor),
      "Ctrl-k": () => deleteToLineEnd(this.editor),
      "Ctrl-K": () => deleteToLineEnd(this.editor),
      "Mod-ArrowLeft": () => moveToLineStart(this.editor),
      "Mod-ArrowRight": () => moveToLineEnd(this.editor),
    };
  },
});

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
  placement,
  suggestions,
  onSelect,
}: {
  activeIndex: number;
  id: string;
  isLoading: boolean;
  placement: "top" | "bottom";
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
}) {
  return (
    <div
      id={id}
      role="listbox"
      className={cn(
        "absolute left-0 z-20 w-max min-w-64 max-w-full overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg",
        placement === "top" ? "bottom-full mb-2" : "top-full mt-2",
      )}
    >
      <div className="max-h-72 overflow-y-auto">
        {suggestions.length === 0 ? (
          <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-muted-foreground">
            {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : null}
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
  attachmentControl,
  className,
  commands = [],
  composerClassName,
  defaultValue,
  disabled = false,
  enableSpeechInput = false,
  editorClassName,
  entities = [],
  isSubmitting = false,
  leadingActions,
  minHeight = 72,
  onAttachmentClick,
  onCommandSelect,
  onEntitySelect,
  onSearchCommands,
  onSearchEntities,
  onSubmit,
  onValueChange,
  placeholder = "Ask anything...",
  rootClassName,
  speechInputLabel = "Voice input",
  speechRecognitionLang,
  suggestionsPlacement = "auto",
  submitLabel = "Send",
  toolbarClassName,
  trailingActions,
  value,
  ...props
}: MessageInputProps) {
  const listId = React.useId();
  const formRef = React.useRef<HTMLFormElement>(null);
  const searchRequestRef = React.useRef(0);
  const isApplyingValueRef = React.useRef(false);
  const activeTriggerRef = React.useRef<ActiveTrigger | null>(null);
  const suggestionsRef = React.useRef<Suggestion[]>([]);
  const selectedIndexRef = React.useRef(0);
  const [activeTrigger, setActiveTrigger] = React.useState<ActiveTrigger | null>(null);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] =
    React.useState(false);
  const [selectedCommand, setSelectedCommand] =
    React.useState<MessageInputCommand | null>(null);
  const [resolvedSuggestionsPlacement, setResolvedSuggestionsPlacement] =
    React.useState<"top" | "bottom">("top");
  const selectSuggestionRef = React.useRef<((suggestion: Suggestion) => void) | null>(null);
  const submitRef = React.useRef<(() => void) | null>(null);
  const speechRecognitionRef = React.useRef<BrowserSpeechRecognition | null>(null);
  const wantsSpeechInputRef = React.useRef(false);
  const [editorState, setEditorState] = React.useState(() => ({
    content: normalizeContent(defaultValue),
    text: typeof defaultValue === "string" ? defaultValue : "",
  }));
  const hasCommandSuggestions = commands.length > 0 || Boolean(onSearchCommands);

  const updateSuggestionsPlacement = React.useCallback(() => {
    if (suggestionsPlacement !== "auto") {
      setResolvedSuggestionsPlacement(suggestionsPlacement);
      return;
    }

    const rect = formRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    setResolvedSuggestionsPlacement(
      spaceBelow > spaceAbove && spaceAbove < 280 ? "bottom" : "top",
    );
  }, [suggestionsPlacement]);

  const getActiveTrigger = React.useCallback(
    (editor: NonNullable<ReturnType<typeof useEditor>>) => {
      const trigger = getActiveTriggerFromEditor(editor);
      if (trigger?.kind === "command" && !hasCommandSuggestions) {
        return null;
      }

      return trigger;
    },
    [hasCommandSuggestions],
  );

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        blockquote: false,
        bulletList: false,
        code: false,
        codeBlock: false,
        dropcursor: false,
        gapcursor: false,
        heading: false,
        horizontalRule: false,
        listItem: false,
        orderedList: false,
      }),
      MessageInputMention,
      MessageInputMacOSShortcuts,
      Placeholder.configure({ placeholder }),
    ],
    content: value ?? normalizeContent(defaultValue),
    editorProps: {
      attributes: {
        class: cn(
          "min-h-0 max-h-64 overflow-y-auto px-4 py-3 text-sm leading-6 outline-none",
          "proseMirror-message-input",
          "[&_.is-empty:first-child::before]:pointer-events-none [&_.is-empty:first-child::before]:float-left [&_.is-empty:first-child::before]:h-0 [&_.is-empty:first-child::before]:text-muted-foreground [&_.is-empty:first-child::before]:content-[attr(data-placeholder)]",
          editorClassName,
        ),
        style: `min-height: ${minHeight}px`,
      },
      handleKeyDown: (_view, event) => {
        const currentSuggestions = suggestionsRef.current;
        if (activeTriggerRef.current && currentSuggestions.length > 0) {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedIndex((current) => (current + 1) % currentSuggestions.length);
            return true;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedIndex(
              (current) =>
                (current - 1 + currentSuggestions.length) %
                currentSuggestions.length,
            );
            return true;
          }

          if (event.key === "Enter" || event.key === "Tab") {
            event.preventDefault();
            selectSuggestionRef.current?.(
              currentSuggestions[selectedIndexRef.current],
            );
            return true;
          }

          if (event.key === "Escape") {
            event.preventDefault();
            setActiveTrigger(null);
            return true;
          }
        }

        if (editor && handleMacOSShortcut(editor, event)) {
          return true;
        }

        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          submitRef.current?.();
          return true;
        }

        return false;
      },
    },
    onUpdate: ({ editor }) => {
      if (isApplyingValueRef.current) return;

      const content = editor.getJSON();
      const text = getTextFromContent(content);
      setEditorState({ content, text });
      onValueChange?.(content, text);

      const nextTrigger = getActiveTrigger(editor);
      if (nextTrigger) {
        updateSuggestionsPlacement();
      }
      setActiveTrigger(nextTrigger);
    },
    onSelectionUpdate: ({ editor }) => {
      const nextTrigger = getActiveTrigger(editor);
      if (nextTrigger) {
        updateSuggestionsPlacement();
      }
      setActiveTrigger(nextTrigger);
    },
  });

  const canSubmit = editorState.text.trim().length > 0 && !disabled && !isSubmitting;
  const showSuggestions = Boolean(activeTrigger);

  React.useEffect(() => {
    activeTriggerRef.current = activeTrigger;
  }, [activeTrigger]);

  React.useEffect(() => {
    suggestionsRef.current = suggestions;
  }, [suggestions]);

  React.useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  React.useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  React.useEffect(() => {
    if (!enableSpeechInput) {
      setSpeechRecognitionSupported(false);
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    setSpeechRecognitionSupported(
      Boolean(speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition),
    );

    return () => {
      wantsSpeechInputRef.current = false;
      speechRecognitionRef.current?.abort();
      speechRecognitionRef.current = null;
    };
  }, [enableSpeechInput]);

  React.useEffect(() => {
    if (!editor || value === undefined) return;
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(value);
    if (current === next) return;

    isApplyingValueRef.current = true;
    editor.commands.setContent(value);
    const content = editor.getJSON();
    setEditorState({ content, text: getTextFromContent(content) });
    isApplyingValueRef.current = false;
  }, [editor, value]);

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
      if (!activeTrigger || !editor) return;

      if (suggestion.kind === "entity") {
        editor
          .chain()
          .focus()
          .deleteRange({ from: activeTrigger.from, to: activeTrigger.to })
          .insertContent([
            {
              type: "messageInputMention",
              attrs: {
                id: suggestion.item.id,
                label: suggestion.item.label,
                type: suggestion.item.type ?? "user",
                color: getEntityColor(suggestion.item),
              },
            },
            { type: "text", text: " " },
          ])
          .run();
        onEntitySelect?.(suggestion.item);
        setActiveTrigger(null);
        return;
      }

      editor
        .chain()
        .focus()
        .deleteRange({ from: activeTrigger.from, to: activeTrigger.to })
        .run();
      setSelectedCommand(suggestion.item);
      onCommandSelect?.(suggestion.item);
      setActiveTrigger(null);
    },
    [activeTrigger, editor, onCommandSelect, onEntitySelect],
  );

  const submit = React.useCallback(() => {
    if (!canSubmit || !editor) return;

    const content = editor.getJSON();
    onSubmit?.({
      text: getTextFromContent(content).trim(),
      entities: getEntitiesFromContent(content, entities),
      command: selectedCommand,
      content,
    });
  }, [canSubmit, editor, entities, onSubmit, selectedCommand]);

  const toggleSpeechInput = React.useCallback(() => {
    if (!editor || !speechRecognitionSupported) return;

    if (isListening) {
      wantsSpeechInputRef.current = false;
      speechRecognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechRecognitionSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = speechRecognitionLang ?? navigator.language;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();

      if (!transcript) return;

      const needsSpace = editorState.text.trim().length > 0;
      editor
        .chain()
        .focus()
        .insertContent(`${needsSpace ? " " : ""}${transcript}`)
        .run();
    };
    recognition.onerror = () => {
      wantsSpeechInputRef.current = false;
      setIsListening(false);
    };
    recognition.onend = () => {
      if (!wantsSpeechInputRef.current) {
        setIsListening(false);
        return;
      }

      try {
        recognition.start();
      } catch {
        wantsSpeechInputRef.current = false;
        setIsListening(false);
      }
    };
    speechRecognitionRef.current = recognition;
    wantsSpeechInputRef.current = true;
    setIsListening(true);

    try {
      recognition.start();
    } catch {
      wantsSpeechInputRef.current = false;
      setIsListening(false);
    }
  }, [
    editor,
    editorState.text,
    isListening,
    speechRecognitionLang,
    speechRecognitionSupported,
  ]);

  React.useEffect(() => {
    selectSuggestionRef.current = selectSuggestion;
    submitRef.current = submit;
  }, [selectSuggestion, submit]);

  return (
    <form
      ref={formRef}
      data-slot="message-input"
      className={cn("relative", rootClassName)}
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
          placement={resolvedSuggestionsPlacement}
          suggestions={suggestions}
          onSelect={selectSuggestion}
        />
      ) : null}

      <div
        className={cn(
          "bg-background transition-colors",
          "focus-within:ring-3 focus-within:ring-ring/20",
          disabled && "opacity-60",
          className,
          composerClassName,
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

        <EditorContent editor={editor} />

        <div
          className={cn(
            "flex items-center justify-between gap-2 px-3 pt-0 pb-3",
            toolbarClassName,
          )}
        >
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            {attachmentControl ??
              (onAttachmentClick ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onAttachmentClick}
                  disabled={disabled}
                  aria-label={attachmentLabel}
                  className="size-8 rounded-full"
                >
                  <Plus className="size-4" />
                </Button>
              ) : null)}
            {leadingActions}
          </div>

          <div className="flex items-center gap-2">
            {trailingActions}
            {enableSpeechInput && speechRecognitionSupported ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleSpeechInput}
                disabled={disabled}
                aria-label={speechInputLabel}
                aria-pressed={isListening}
                className={cn(
                  "size-8 rounded-full",
                  isListening &&
                    "bg-muted text-foreground hover:bg-muted",
                )}
              >
                {isListening ? (
                  <Square className="size-3 fill-current" />
                ) : (
                  <Mic className="size-4" />
                )}
              </Button>
            ) : null}
            <Button
              type="submit"
              size="icon"
              disabled={!canSubmit}
              aria-label={submitLabel}
              className="size-9 rounded-full"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
