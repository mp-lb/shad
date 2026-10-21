export type DatedChatMessage = { createdAt: Date | string | number };

export type ChatTimelineItem<T> =
  | { type: "date-heading"; key: string; day: string; label: string }
  | { type: "message"; message: T };

/** Inserts one heading before each new local calendar day in chronological input. */
export function interleaveDateHeadings<T extends DatedChatMessage>(
  messages: readonly T[],
  locale?: string,
): ChatTimelineItem<T>[] {
  const result: ChatTimelineItem<T>[] = [];
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let previousDay = "";

  messages.forEach((message, index) => {
    const date =
      message.createdAt instanceof Date
        ? new Date(message.createdAt.getTime())
        : new Date(message.createdAt);
    if (Number.isNaN(date.getTime())) {
      throw new RangeError("Message createdAt must be a valid date");
    }
    const day = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    if (day !== previousDay) {
      result.push({
        type: "date-heading",
        key: `${day}:${index}`,
        day,
        label: formatter.format(date),
      });
      previousDay = day;
    }
    result.push({ type: "message", message });
  });

  return result;
}
