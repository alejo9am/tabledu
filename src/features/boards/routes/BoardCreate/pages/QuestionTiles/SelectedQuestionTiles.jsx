import { Edit02Icon, RemoveCircleHalfDotIcon } from '@hugeicons/core-free-icons'
import TileCard from '@/components/game/TileCard'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function SelectedQuestionTile({ tile, questionCount, isLoadingQuestionCounts, onDeselect, onEdit }) {
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
    <article className="flex w-full max-w-52 flex-col gap-3 rounded-xl border bg-card p-3">
      <div className="flex items-center gap-3">
        <TileCard tile={{ ...tile, type: 'question' }} showShadow={false} className="size-16 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate text-sm font-medium text-foreground" title={tile.name}>{tile.name}</p>

          {isLoadingQuestionCounts ? (
            <Skeleton className="h-6 w-24 rounded-full" />
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={questionCountBadgeVariant} className="w-fit cursor-help">
                  {questionCountLabel}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="right">{questionCountTooltip}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => onEdit(tile)}>
          <Icon icon={Edit02Icon} className="size-4" />
          Edit
        </Button>
        <Button type="button" size="sm" variant="destructive-soft" onClick={() => onDeselect(tile)}>
          <Icon icon={RemoveCircleHalfDotIcon} className="size-4" />
          Remove
        </Button>
      </div>
    </article>
  )
}

function SelectedQuestionTiles({ selectedTiles, questionCountsByTileId, isLoadingQuestionCounts, onDeselect, onEdit }) {
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
              key={tile.id}
              tile={tile}
              questionCount={questionCountsByTileId[tile.id] ?? 0}
              isLoadingQuestionCounts={isLoadingQuestionCounts}
              onDeselect={onDeselect}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectedQuestionTiles
