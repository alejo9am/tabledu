import * as React from "react"

import { cn } from "@/lib/utils"

function Empty({ className, ...props }) {
  return (
    <div
      data-slot="empty"
      className={cn("flex w-full flex-col items-center justify-center gap-6 text-center", className)}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-md flex-col items-center gap-3", className)}
      {...props}
    />
  )
}

function EmptyMedia({ className, variant = "default", ...props }) {
  return (
    <div
      data-slot="empty-media"
      data-variant={variant}
      className={cn(
        "flex items-center justify-center rounded-xl border border-border bg-muted/50",
        variant === "icon" ? "size-14" : "p-2",
        className
      )}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }) {
  return (
    <h2
      data-slot="empty-title"
      className={cn("text-xl font-semibold tracking-tight text-primary", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }) {
  return (
    <p
      data-slot="empty-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }) {
  return (
    <div
      data-slot="empty-content"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
      {...props}
    />
  )
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle }
