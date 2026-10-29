"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ArrayEditorObjectItem = {
  id: string;
  label: string;
  description?: string;
};

export type ArrayEditorItem = string | ArrayEditorObjectItem;

export type ArrayEditorProps = {
  addButtonLabel?: string;
  className?: string;
  createDisabled?: boolean;
  createPlaceholder?: string;
  deleteDisabled?: boolean;
  editDisabled?: boolean;
  emptyLabel?: string;
  items: ArrayEditorItem[];
  minItems?: number;
  onCreate?: (label: string) => void;
  onDelete?: (itemId: string) => void;
  onEdit?: (itemId: string) => void;
  onMove?: (fromIndex: number, toIndex: number) => void;
  onRename?: (itemId: string, label: string) => void;
  renameDisabled?: boolean;
  /** Custom inline rows and forms. Omitting these preserves the simple editor. */
  renderItem?: (item: ArrayEditorObjectItem, index: number) => React.ReactNode;
  renderEditor?: (item: ArrayEditorObjectItem) => React.ReactNode;
  editingId?: string | null;
  renderCreate?: () => React.ReactNode;
  creating?: boolean;
  onStartCreate?: () => void;
  listLabel?: string;
};

export type ListEditorProps = ArrayEditorProps;
export type ListEditorItem = ArrayEditorItem;

export type ArrayEditorDialogProps = ArrayEditorProps & {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

function normalizeArrayEditorItem(
  item: ArrayEditorItem,
): ArrayEditorObjectItem {
  return typeof item === "string" ? { id: item, label: item } : item;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const restrictToListArea: Modifier = ({
  containerNodeRect,
  draggingNodeRect,
  transform,
}) => {
  const verticalTransform = {
    ...transform,
    x: 0,
  };

  if (!containerNodeRect || !draggingNodeRect) {
    return verticalTransform;
  }

  return {
    ...verticalTransform,
    y: clamp(
      verticalTransform.y,
      containerNodeRect.top - draggingNodeRect.top,
      containerNodeRect.bottom - draggingNodeRect.bottom,
    ),
  };
};

function ArrayEditorRow({
  canDelete,
  deleteDisabled,
  editDisabled,
  item,
  onDelete,
  onEdit,
  onMove,
  onRename,
  renameDisabled,
  renderItem,
  renderEditor,
  editingId,
  index,
}: {
  renderItem?: ArrayEditorProps["renderItem"];
  renderEditor?: ArrayEditorProps["renderEditor"];
  editingId?: string | null;
  index: number;
  canDelete: boolean;
  deleteDisabled: boolean;
  editDisabled: boolean;
  item: ArrayEditorObjectItem;
  onDelete?: (itemId: string) => void;
  onEdit?: (itemId: string) => void;
  onMove?: (fromIndex: number, toIndex: number) => void;
  onRename?: (itemId: string, label: string) => void;
  renameDisabled: boolean;
}) {
  const [draftLabel, setDraftLabel] = React.useState(item.label);
  const isRenameEnabled = Boolean(onRename) && !renameDisabled;

  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id, disabled: !onMove });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined,
    borderWidth: isDragging && renderItem ? 0 : undefined,
  };

  function commitRename() {
    const nextLabel = draftLabel.trim();

    if (!nextLabel) {
      setDraftLabel(item.label);
      return;
    }

    if (nextLabel !== item.label) {
      onRename?.(item.id, nextLabel);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("min-w-0", isDragging && "relative z-10 bg-background")}
    >
      <div
        className={cn(
          renderItem
            ? "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-background px-3 py-2.5"
            : "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-md border bg-background px-2 py-2",
          isDragging && !renderItem && "shadow-lg",
        )}
      >
        <button
          ref={setActivatorNodeRef}
          type="button"
          className={cn(
            "flex h-8 w-7 items-center justify-center rounded-md text-muted-foreground",
            onMove
              ? "cursor-grab hover:bg-muted active:cursor-grabbing"
              : "cursor-default opacity-40",
          )}
          aria-label={`Move ${item.label}`}
          disabled={!onMove}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <div className="min-w-0">
          {renderItem ? (
            renderItem(item, index)
          ) : isRenameEnabled ? (
            <Input
              className="h-7 w-full border-transparent bg-transparent px-2 text-sm font-medium shadow-none hover:border-input focus-visible:ring-0"
              value={draftLabel}
              onChange={(event) => setDraftLabel(event.target.value)}
              onBlur={commitRename}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }

                if (event.key === "Escape") {
                  setDraftLabel(item.label);
                  event.currentTarget.blur();
                }
              }}
            />
          ) : (
            <div className="truncate px-2 text-sm font-medium">
              {item.label}
            </div>
          )}
          {!renderItem && item.description ? (
            <div className="truncate px-2 text-xs text-muted-foreground">
              {item.description}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {onEdit ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => onEdit(item.id)}
              disabled={editDisabled}
              aria-label={`Edit ${item.label}`}
              aria-expanded={renderEditor ? editingId === item.id : undefined}
            >
              <Pencil className="size-3.5" />
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(item.id)}
              disabled={!canDelete || deleteDisabled}
              aria-label={`Delete ${item.label}`}
            >
              <X className="size-3.5" />
            </Button>
          ) : null}
        </div>
      </div>
      {renderEditor && editingId === item.id ? renderEditor(item) : null}
    </div>
  );
}

function ArrayEditorCreateRow({
  addButtonLabel,
  createDisabled,
  createPlaceholder,
  onCreate,
}: {
  addButtonLabel: string;
  createDisabled: boolean;
  createPlaceholder: string;
  onCreate: (label: string) => void;
}) {
  const [draftLabel, setDraftLabel] = React.useState("");
  const canCreate = draftLabel.trim().length > 0 && !createDisabled;

  function createItem() {
    const nextLabel = draftLabel.trim();

    if (!nextLabel || createDisabled) {
      return;
    }

    onCreate(nextLabel);
    setDraftLabel("");
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={draftLabel}
        onChange={(event) => setDraftLabel(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            createItem();
          }
        }}
        placeholder={createPlaceholder}
        disabled={createDisabled}
      />
      <Button
        type="button"
        variant="outline"
        onClick={createItem}
        disabled={!canCreate}
      >
        <Plus className="size-4" />
        {addButtonLabel}
      </Button>
    </div>
  );
}

export function ListEditor({
  addButtonLabel = "Add",
  className,
  createDisabled = false,
  createPlaceholder = "New item label",
  deleteDisabled = false,
  editDisabled = false,
  emptyLabel = "No items",
  items,
  minItems = 0,
  onCreate,
  onDelete,
  onEdit,
  onMove,
  onRename,
  renameDisabled = false,
  renderItem,
  renderEditor,
  editingId,
  renderCreate,
  creating = false,
  onStartCreate,
  listLabel = "Items",
}: ArrayEditorProps) {
  const normalizedItems = React.useMemo(
    () => items.map(normalizeArrayEditorItem),
    [items],
  );

  const sortableIds = React.useMemo(
    () => normalizedItems.map((item) => item.id),
    [normalizedItems],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function finishDrag(event: DragEndEvent): void {
    if (!onMove) {
      return;
    }

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const fromIndex = normalizedItems.findIndex(
      (item) => item.id === active.id,
    );

    const toIndex = normalizedItems.findIndex((item) => item.id === over.id);

    if (fromIndex !== -1 && toIndex !== -1) {
      onMove(fromIndex, toIndex);
    }
  }

  const editorRows = (
    <div className={renderItem ? "divide-y" : "grid gap-2"}>
      {normalizedItems.length > 0 ? (
        normalizedItems.map((item) => (
          <ArrayEditorRow
            key={`${item.id}:${item.label}`}
            index={normalizedItems.indexOf(item)}
            renderItem={renderItem}
            renderEditor={renderEditor}
            editingId={editingId}
            canDelete={items.length > minItems}
            deleteDisabled={deleteDisabled}
            editDisabled={editDisabled}
            item={item}
            onDelete={onDelete}
            onEdit={onEdit}
            onMove={onMove}
            onRename={onRename}
            renameDisabled={renameDisabled}
          />
        ))
      ) : renderItem ? null : (
        <div className="rounded-md border border-dashed bg-background px-3 py-4 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("grid gap-3", className)}>
      <div
        aria-label={listLabel}
        role="list"
        className={renderItem ? "overflow-hidden rounded-lg border" : undefined}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToListArea]}
          onDragEnd={finishDrag}
        >
          <SortableContext
            items={sortableIds}
            strategy={verticalListSortingStrategy}
          >
            {editorRows}
          </SortableContext>
        </DndContext>
        {onStartCreate ? (
          <div
            role="listitem"
            className={cn(
              renderItem && normalizedItems.length > 0 && "border-t",
            )}
          >
            {creating && renderCreate ? (
              renderCreate()
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="h-auto w-full justify-start rounded-none border-0 px-4 py-2.5 text-muted-foreground"
                disabled={createDisabled}
                onClick={onStartCreate}
              >
                <Plus className="size-4" />
                {addButtonLabel}
              </Button>
            )}
          </div>
        ) : null}
      </div>
      {onCreate ? (
        <ArrayEditorCreateRow
          addButtonLabel={addButtonLabel}
          createDisabled={createDisabled}
          createPlaceholder={createPlaceholder}
          onCreate={onCreate}
        />
      ) : null}
    </div>
  );
}

export const ArrayEditor = ListEditor;

export function ArrayEditorDialog({
  onOpenChange,
  open,
  title,
  ...arrayEditorProps
}: ArrayEditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <ArrayEditor {...arrayEditorProps} />
        </div>
        <div className="flex justify-end border-t px-6 py-4">
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
