import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const STATUS_BADGE_VARIANT = {
  playing: 'default',
  lobby: 'secondary',
  finished: 'ghost',
}

function formatUpdatedAt(value) {
  if (!value) {
    return 'No recent updates'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'No recent updates'
  }

  return date.toLocaleString()
}

function GameCard({ game = null, isLoading = false, primaryActionLabel = 'Open Session', onPrimaryAction }) {
  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-xl animate-in fade-in" />
  }

  const status = game?.status ?? 'lobby'
  const isPlayable = status === 'playing'
  const badgeVariant = STATUS_BADGE_VARIANT[status] ?? 'outline'
  const title = game?.pin ? `PIN ${String(game.pin).toUpperCase()}` : `Game #${game?.id}`

  return (
    <article className="group relative min-h-32 overflow-hidden rounded-xl border border-primary-200/60 bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary-350 animate-in fade-in">
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-1.5">
        <span className="h-full w-1/3 bg-primary" />
        <span className="h-full w-1/3 bg-warning" />
        <span className="h-full w-1/3 bg-destructive" />
      </div>

      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-xl leading-tight text-primary-700">{title}</p>
          <Badge variant={badgeVariant}>{status}</Badge>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Board: {game?.board_id ?? 'Unknown'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/90">
          Updated: {formatUpdatedAt(game?.updated_at)}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 sm:justify-end">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onPrimaryAction}
            disabled={!isPlayable || typeof onPrimaryAction !== 'function'}
          >
            {primaryActionLabel}
          </Button>
        </div>
      </div>
    </article>
  )
}

export default GameCard
