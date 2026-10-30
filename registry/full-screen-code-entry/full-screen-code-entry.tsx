"use client";

import { Fragment, useId, type ComponentProps, type ReactNode } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FullScreenState } from "@/components/full-screen-state";

type FullScreenCodeEntryProps = Pick<
  ComponentProps<typeof FullScreenState>,
  "icon" | "title" | "description" | "className"
> & {
  code: string;
  onCodeChange: (code: string) => void;
  onConfirm: (code: string) => void;
  codeLength?: number;
  groupSize?: number;
  codeLabel?: string;
  confirmLabel?: string;
  pendingLabel?: string;
  pending?: boolean;
  error?: ReactNode;
};

export function FullScreenCodeEntry({
  code,
  onCodeChange,
  onConfirm,
  codeLength = 8,
  groupSize = 4,
  codeLabel = "Confirmation code",
  confirmLabel = "Approve",
  pendingLabel = "Approving…",
  pending = false,
  error,
  title = "Confirm your code",
  description = "Check that this code matches the one in your terminal. Only approve a request you started.",
  ...layout
}: FullScreenCodeEntryProps) {
  const inputId = useId();
  const errorId = useId();
  const complete = code.length === codeLength && /^[a-z0-9]+$/i.test(code);

  return (
    <FullScreenState {...layout} title={title} description={description}>
      <form
        className="mt-3 flex w-full flex-col items-center gap-4"
        aria-busy={pending}
        onSubmit={(event) => {
          event.preventDefault();
          if (complete && !pending) onConfirm(code);
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          {codeLabel}
        </label>
        <InputOTP
          id={inputId}
          value={code}
          onChange={(value) => onCodeChange(value.toUpperCase())}
          maxLength={codeLength}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          inputMode="text"
          autoComplete="one-time-code"
          pasteTransformer={(value) =>
            value.replace(/[\s-]/g, "").toUpperCase()
          }
          disabled={pending}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          containerClassName="justify-center gap-2"
        >
          {Array.from(
            { length: Math.ceil(codeLength / groupSize) },
            (_, group) => (
              <Fragment key={group}>
                {group > 0 ? <InputOTPSeparator /> : null}
                <InputOTPGroup>
                  {Array.from(
                    {
                      length: Math.min(
                        groupSize,
                        codeLength - group * groupSize,
                      ),
                    },
                    (_, slot) => (
                      <InputOTPSlot
                        key={slot}
                        index={group * groupSize + slot}
                        className="h-12 w-6 text-lg sm:h-16 sm:w-10 sm:text-2xl"
                      />
                    ),
                  )}
                </InputOTPGroup>
              </Fragment>
            ),
          )}
        </InputOTP>
        {error ? (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={!complete || pending}>
          {pending ? pendingLabel : confirmLabel}
        </Button>
      </form>
    </FullScreenState>
  );
}
