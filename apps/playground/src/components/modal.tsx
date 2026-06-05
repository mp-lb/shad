"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg" | "xl";

type ModalRootProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

type ModalHeaderInput = {
  description?: React.ReactNode;
  header?: React.ReactNode;
  title?: React.ReactNode;
};

type StandardModalProps = ModalRootProps &
  ModalHeaderInput & {
    bodyClassName?: string;
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
    footerClassName?: string;
    showCloseButton?: boolean;
    size?: ModalSize;
  };

type FullscreenModalProps = Omit<StandardModalProps, "size"> & {
  inset?: "default" | "compact" | "none";
};

type AlertModalProps = ModalRootProps & {
  actionLabel?: string;
  actionVariant?: React.ComponentProps<typeof Button>["variant"];
  cancelLabel?: string;
  children?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  onAction?: () => void;
  onCancel?: () => void;
  title: React.ReactNode;
};

const standardSizeClasses: Record<ModalSize, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-xl",
  lg: "sm:max-w-3xl",
  xl: "sm:max-w-4xl",
};

const fullscreenInsetClasses: Record<
  NonNullable<FullscreenModalProps["inset"]>,
  string
> = {
  default:
    "h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] sm:h-[calc(100dvh-3rem)] sm:w-[calc(100%-3rem)]",
  compact:
    "h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] sm:h-[calc(100dvh-2rem)] sm:w-[calc(100%-2rem)]",
  none: "h-dvh w-screen rounded-none",
};

function ModalFrame({
  bodyClassName,
  children,
  className,
  footer,
  footerClassName,
  header,
  onOpenChange,
  open,
  showCloseButton = true,
}: ModalRootProps & {
  bodyClassName?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
  header: React.ReactNode;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          "flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-lg bg-background p-0 [&_[data-slot=dialog-header]]:pr-12",
          className,
        )}
      >
        {header}
        <ModalBody className={cn("px-6 py-4", bodyClassName)}>
          {children}
        </ModalBody>
        {footer ? (
          <ModalFooter className={cn("border-t px-6 py-4", footerClassName)}>
            {footer}
          </ModalFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ModalHeader({
  description,
  header,
  title,
}: ModalHeaderInput): React.ReactNode {
  if (header) {
    return header;
  }

  return (
    <DialogHeader className="border-b px-6 py-4">
      <DialogTitle>{title}</DialogTitle>
      {description ? (
        <DialogDescription>{description}</DialogDescription>
      ) : null}
    </DialogHeader>
  );
}

export function ModalBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-body"
      className={cn("min-h-0 flex-1 overflow-y-auto", className)}
      {...props}
    />
  );
}

export function ModalFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export function StandardModal({
  bodyClassName,
  children,
  className,
  footer,
  footerClassName,
  onOpenChange,
  open,
  showCloseButton,
  size = "md",
  ...headerInput
}: StandardModalProps) {
  return (
    <ModalFrame
      bodyClassName={bodyClassName}
      className={cn(
        "top-1/2 w-[calc(100%-2rem)] -translate-y-1/2 sm:w-full",
        standardSizeClasses[size],
        className,
      )}
      footer={footer}
      footerClassName={footerClassName}
      header={<ModalHeader {...headerInput} />}
      onOpenChange={onOpenChange}
      open={open}
      showCloseButton={showCloseButton}
    >
      {children}
    </ModalFrame>
  );
}

export function FullscreenModal({
  bodyClassName,
  children,
  className,
  footer,
  footerClassName,
  inset = "default",
  onOpenChange,
  open,
  showCloseButton,
  ...headerInput
}: FullscreenModalProps) {
  return (
    <ModalFrame
      bodyClassName={bodyClassName}
      className={cn(
        "top-1/2 max-w-none -translate-y-1/2 sm:max-w-none",
        fullscreenInsetClasses[inset],
        className,
      )}
      footer={footer}
      footerClassName={footerClassName}
      header={<ModalHeader {...headerInput} />}
      onOpenChange={onOpenChange}
      open={open}
      showCloseButton={showCloseButton}
    >
      {children}
    </ModalFrame>
  );
}

export function AlertModal({
  actionLabel = "OK",
  actionVariant = "default",
  cancelLabel,
  children,
  description,
  footer,
  onAction,
  onCancel,
  onOpenChange,
  open,
  title,
}: AlertModalProps) {
  const close = () => onOpenChange(false);

  const defaultFooter = (
    <>
      {cancelLabel ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onCancel?.();
            close();
          }}
        >
          {cancelLabel}
        </Button>
      ) : null}
      <Button
        type="button"
        variant={actionVariant}
        onClick={() => {
          onAction?.();
          close();
        }}
      >
        {actionLabel}
      </Button>
    </>
  );

  return (
    <StandardModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      bodyClassName="py-4"
      footer={footer ?? defaultFooter}
    >
      {children}
    </StandardModal>
  );
}
