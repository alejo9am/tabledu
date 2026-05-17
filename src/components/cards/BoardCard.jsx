import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

function BoardCard({
  board = null,
  isLoading = false,
  primaryActionLabel = "See details",
  onPrimaryAction,
  secondaryActionLabel,
  secondaryActionWarning = false,
  onSecondaryAction,
}) {
  const title = board?.name ?? ""
  const description = board?.description ?? "Open board details to start a game session."
  const hasPrimaryAction = typeof onPrimaryAction === "function"
  const hasSecondaryAction = Boolean(secondaryActionLabel) && typeof onSecondaryAction === "function"
  const secondaryVariant = secondaryActionWarning ? "warning" : "secondary"

  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-xl animate-in fade-in" />
  }

  return (
    <article className="group relative min-h-32 overflow-hidden rounded-xl border border-primary-200/60 bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary-350 animate-in fade-in">
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-1.5">
        <span className="h-full w-1/3 bg-primary" />
        <span className="h-full w-1/3 bg-warning" />
        <span className="h-full w-1/3 bg-destructive" />
      </div>
      <div className="flex h-full flex-col">
        <p className="truncate text-xl leading-tight text-primary-700 dark:text-primary-200">{title || `Board #${board.id}`}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2 sm:justify-end">
          {hasSecondaryAction ? (
            <Button type="button" variant={secondaryVariant} size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          ) : null}
          {hasPrimaryAction ? (
            <Button type="button" variant="default" size="sm" onClick={onPrimaryAction}>
              {primaryActionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default BoardCard
