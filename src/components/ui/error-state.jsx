import { Alert02Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  technicalDetails,
  retryLabel = 'Try again',
  onRetry = () => {
    window.location.reload()
  },
  showSecondaryAction = false,
  className,
}) {
  return (
    <section className={cn('w-full max-w-xl rounded-3xl border-2 border-dashed bg-card p-8 text-center', className)}>
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-warning-200 border border-warning-700 text-destructive">
        <Icon icon={Alert02Icon} />
      </div>

      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">{description}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" onClick={onRetry}>
          {retryLabel}
        </Button>

        {showSecondaryAction ? (
          <Button variant="secondary" size="lg" onClick={() => {
            window.location.href = '/'
          }}>
            Go to dashboard
          </Button>
        ) : null}
      </div>

      {technicalDetails ? (
        <details className="group mx-auto mt-5 w-full max-w-xl">
          <summary className="flex cursor-pointer list-none items-center justify-center gap-2 border-t border-border pt-4 text-xs font-semibold tracking-wide text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
            Technical details
            <Icon className="size-4 transition-transform duration-500 group-open:rotate-180" icon={ArrowDown01Icon} />
          </summary>

          <p className="mt-2 wrap-break-word rounded-lg border border-border bg-background/80 p-3 text-sm text-foreground/90">
            {technicalDetails}
          </p>
        </details>
      ) : null}
    </section>
  )
}

export default ErrorState
