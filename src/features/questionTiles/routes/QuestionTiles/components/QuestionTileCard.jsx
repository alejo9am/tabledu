import { Link } from 'react-router-dom'
import { Delete02Icon, Edit02Icon } from '@hugeicons/core-free-icons'

import TileCard from '@/components/game/TileCard'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'

function QuestionTileCard({ tile, isDeleting, onOpen, onEdit, onDelete }) {

  return (
    <article className="rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => onOpen(tile.id)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left transition-opacity hover:opacity-90"
          aria-label={`Open ${tile.name} question tile`}
        >
          <TileCard tile={tile} showShadow={false} className="size-16 shrink-0" />
          <div className="min-w-0">
            <h3 className="truncate font-display text-2xl font-semibold text-foreground">{tile.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {tile.description || 'Topic container for related questions.'}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(tile)}
            disabled={isDeleting}
            aria-label={`Edit ${tile.name}`}
          >
            <Icon icon={Edit02Icon} className="size-4" />
          </Button>
          <Button
            type="button"
            variant="destructive-soft"
            size="icon"
            onClick={() => onDelete(tile)}
            disabled={isDeleting}
            aria-label={`Delete ${tile.name}`}
          >
            <Icon icon={Delete02Icon} className="size-4" />
          </Button>
        </div>
      </div>

      <Link
        to={`/tiles/questions/${tile.id}`}
        className="mt-4 flex items-center justify-between rounded-xl border-2 border-dashed bg-muted/40 px-3 py-2 transition-opacity hover:opacity-90"
        aria-label={`Open ${tile.name} question tile`}
      >
        <span className="text-xs font-medium text-muted-foreground">Question bank size</span>
        <span className="font-display text-base font-semibold text-foreground">
          {(() => {
            const questionCount = tile.questionCount ?? 0
            return questionCount === 1 ? '1 question' : `${questionCount} questions`
          })()}
        </span>
      </Link>
    </article>
  )
}

export default QuestionTileCard
