import { Delete02Icon } from '@hugeicons/core-free-icons'
import TileCard from '@/components/game/TileCard'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getQuestionTileKey } from '@/features/boards/routes/BoardCreate/pages/QuestionTiles/questionTiles.utils'

function SelectedQuestionTile({ tile, questionCount, isLoadingQuestionCounts, onDeselect }) {
  const questionCountLabel = questionCount === 1 ? '1 question' : `${questionCount} questions`
  const questionCountBadgeVariant = questionCount === 0
    ? 'destructive'
    : questionCount < 10
      ? 'warning'
      : 'default'
  const questionCountTooltip = questionCount === 0
    ? 'This tile has no questions yet. Add questions to this bank before gameplay.'
    : questionCount < 10
      ? 'This tile has few questions, so repeats may happen often during play.'
      : 'This bank has enough questions for good variety during play.'

  return (
    <article className="relative flex h-40 w-full max-w-36 flex-col items-center justify-between rounded-xl border bg-card p-3 text-center">
      <Button
        type="button"
        variant="destructive"
        size="icon-sm"
        className="absolute top-1.5 right-1.5 z-10 rounded-full bg-card shadow-sm hover:bg-destructive-200"
        onClick={() => onDeselect(tile)}
        aria-label={`Remove ${tile.name}`}
      >
        <Icon icon={Delete02Icon} className="size-5" />
      </Button>

      <div className="flex flex-col items-center gap-2">
        <TileCard tile={{ ...tile, type: 'question' }} showShadow={false} className="size-18" />
        <p className="w-full truncate text-sm font-medium text-foreground" title={tile.name}>{tile.name}</p>
      </div>

      {isLoadingQuestionCounts ? (
        <Skeleton className="h-6 w-24 rounded-full" />
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={questionCountBadgeVariant} className="self-stretch cursor-help">
              {questionCountLabel}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">{questionCountTooltip}</TooltipContent>
        </Tooltip>
      )}
    </article>
  )
}

function SelectedQuestionTiles({ selectedTiles, questionCountsByTileId, isLoadingQuestionCounts, onDeselect }) {
  const totalQuestionBankSize = selectedTiles.reduce(
    (total, tile) => total + (questionCountsByTileId[tile.id] ?? 0),
    0
  )
  const totalQuestionBankSizeLabel = totalQuestionBankSize === 1
    ? '1 question total'
    : `${totalQuestionBankSize} questions total`

  return (
    <div className="rounded-2xl flex flex-col items-center border bg-card p-4">
      <div className="flex w-full items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm font-medium text-muted-foreground">
              Selected tiles: <span className="font-semibold text-foreground">{selectedTiles.length}</span> / 6
            </p>
          </TooltipTrigger>
          <TooltipContent side="right">
            You can select up to 6 question tiles for this board. Select more tiles to increase gameplay variety
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            {isLoadingQuestionCounts ? (
              <Skeleton className="h-6 w-28 rounded-full" />
            ) : (
              <Badge variant="secondary" className="text-sm font-medium cursor-help">
                {totalQuestionBankSizeLabel}
              </Badge>
            )}
          </TooltipTrigger>
          {!isLoadingQuestionCounts ? (
            <TooltipContent side="left">
              Total number of questions available across your selected tiles.
            </TooltipContent>
          ) : null}
        </Tooltip>
      </div>

      {selectedTiles.length === 0 ? (
        <Empty className="mt-3 h-40 w-fit rounded-xl border-2 border-dashed p-6">
          <EmptyHeader className="max-w-56">
            <EmptyTitle className="text-base">No question tiles selected yet</EmptyTitle>
            <EmptyDescription>
              Select question tiles from the list below to include them in this board.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="mt-3 flex flex-wrap justify-center gap-3 lg:flex-nowrap">
          {selectedTiles.map((tile) => (
            <SelectedQuestionTile
              key={getQuestionTileKey(tile)}
              tile={tile}
              questionCount={questionCountsByTileId[tile.id] ?? 0}
              isLoadingQuestionCounts={isLoadingQuestionCounts}
              onDeselect={onDeselect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectedQuestionTiles
