"use client";

import * as React from "react";

import {
  ArrayEditor,
  type ArrayEditorObjectItem,
} from "../../../registry/array-editor/array-editor";

const initialItems: ArrayEditorObjectItem[] = [
  {
    id: "ada",
    label: "Ada Lovelace",
    description: "First implementation pass",
  },
  {
    id: "grace",
    label: "Grace Hopper",
    description: "Compiler notes",
  },
  {
    id: "katherine",
    label: "Katherine Johnson",
    description: "Flight checks",
  },
];

function move<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export function ArrayEditorDemo() {
  const [items, setItems] = React.useState(initialItems);
  const [lastEdited, setLastEdited] = React.useState<string | null>(null);

  return (
    <div className="grid gap-3">
      <ArrayEditor
        items={items}
        onCreate={(label) =>
          setItems((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              label,
            },
          ])
        }
        onDelete={(itemId) =>
          setItems((current) => current.filter((item) => item.id !== itemId))
        }
        onEdit={(itemId) => setLastEdited(itemId)}
        onMove={(fromIndex, toIndex) =>
          setItems((current) => move(current, fromIndex, toIndex))
        }
        onRename={(itemId, label) =>
          setItems((current) =>
            current.map((item) =>
              item.id === itemId ? { ...item, label } : item,
            ),
          )
        }
      />
      {lastEdited ? (
        <p className="text-sm text-muted-foreground">
          Edit callback: {items.find((item) => item.id === lastEdited)?.label}
        </p>
      ) : null}
    </div>
  );
}
