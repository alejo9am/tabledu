import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/Icon"
import { Skeleton } from "@/components/ui/skeleton"

function PageHeader({
  title,
  description,
  ctaLabel,
  ctaSubtitle,
  ctaIcon,
  ctaOnClick,
  isLoading = false,
}) {
  const hasCta = Boolean(ctaLabel) && typeof ctaOnClick === "function"

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-8 w-56 sm:h-10 sm:w-72" />
          <Skeleton className="mt-2 h-5 w-full max-w-md" />
        </div>
        <Skeleton className="h-12 w-full sm:w-56" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6">
      <div className="min-w-0">
        <h1 className="text-xl font-display font-semibold text-primary sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p> : null}
      </div>
      {hasCta ? (
        <div className="flex w-full items-center sm:w-auto sm:shrink-0 sm:justify-end">
          <Button
            variant="warning"
            size="sm"
            className="h-auto w-full items-center justify-center gap-2 px-3 py-2 sm:w-auto sm:justify-start sm:gap-3 sm:px-4 sm:py-3"
            onClick={ctaOnClick}
          >
            {ctaIcon ? <Icon icon={ctaIcon} className="size-5 sm:size-6" /> : null}
            <span className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold">{ctaLabel}</span>
              {ctaSubtitle ? <span className="hidden text-xs opacity-80 sm:inline">{ctaSubtitle}</span> : null}
            </span>
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default PageHeader
