"use client";

import * as React from "react";

import {
  AvatarStack,
  AvatarStackItem,
} from "../../../registry/avatar-stack/avatar-stack";

const people = [
  "Ada Lovelace",
  "Grace Hopper",
  "Alan Turing",
  "Katherine Johnson",
  "Edsger Dijkstra",
  "Barbara Liskov",
  "Donald Knuth",
];

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const getColorStyle = (value: string) => {
  const hash = [...value].reduce(
    (currentHash, character) =>
      character.charCodeAt(0) + ((currentHash << 5) - currentHash),
    0,
  );

  return { backgroundColor: `hsl(${Math.abs(hash) % 360} 58% 42%)` };
};

function InitialsItem({ name }: { name: string }) {
  return (
    <AvatarStackItem
      aria-label={name}
      className="font-semibold text-white"
      style={getColorStyle(name)}
    >
      {getInitials(name)}
    </AvatarStackItem>
  );
}

function DemoRow({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border bg-muted/30 p-4">
      <div className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-6">{children}</div>
    </div>
  );
}

export function AvatarStackDemo() {
  return (
    <div className="grid gap-4">
      <DemoRow label="Images">
        <AvatarStack size="lg">
          {[12, 32, 5, 47].map((seed, index) => (
            <AvatarStackItem key={seed}>
              <img
                alt={people[index]}
                src={`https://i.pravatar.cc/96?img=${seed}`}
              />
            </AvatarStackItem>
          ))}
        </AvatarStack>
      </DemoRow>

      <DemoRow label="Custom content with overflow count (max 4)">
        <AvatarStack max={4} size="md">
          {people.map((name) => (
            <InitialsItem key={name} name={name} />
          ))}
        </AvatarStack>
      </DemoRow>

      <DemoRow label="Size presets">
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <AvatarStack key={size} size={size}>
            {people.slice(0, 3).map((name) => (
              <InitialsItem key={name} name={name} />
            ))}
          </AvatarStack>
        ))}
      </DemoRow>

      <DemoRow label="Overlap presets">
        {(["none", "sm", "md", "lg"] as const).map((overlap) => (
          <AvatarStack key={overlap} overlap={overlap} size="md">
            {people.slice(0, 3).map((name) => (
              <InitialsItem key={name} name={name} />
            ))}
          </AvatarStack>
        ))}
      </DemoRow>

      <DemoRow label="Arbitrary diameter via CSS variables">
        <AvatarStack className="[--avatar-stack-overlap:0.875rem] [--avatar-stack-size:3.5rem] text-lg">
          {people.slice(0, 4).map((name) => (
            <InitialsItem key={name} name={name} />
          ))}
        </AvatarStack>
      </DemoRow>
    </div>
  );
}
