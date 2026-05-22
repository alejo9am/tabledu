import { Delete02Icon } from '@hugeicons/core-free-icons'
import CategoryTile from '@/components/game/CategoryTile'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { getQuestionTileKey } from '@/features/boards/routes/BoardCreate/pages/QuestionTiles/questionTiles.utils'

function SelectedQuestionTile({ tile, questionCount, onDeselect }) {
  const questionCountLabel = questionCount === 1 ? '1 question' : `${questionCount} questions`

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
        <CategoryTile category={{ ...tile, type: 'question' }} showShadow={false} className="size-18" />
        <p className="w-full truncate text-sm font-medium text-foreground" title={tile.name}>{tile.name}</p>
      </div>

      <Badge variant={questionCount > 0 ? (questionCount > 5 ? 'default' : 'secondary') : 'destructive'} className="self-stretch">
        {questionCountLabel}
      </Badge>
    </article>
  )
}

function SelectedQuestionTiles({ selectedTiles, questionCountsByCategoryId, onDeselect }) {
  const totalQuestionBankSize = selectedTiles.reduce(
    (total, tile) => total + (questionCountsByCategoryId[tile.id] ?? 0),
    0
  )
  const totalQuestionBankSizeLabel = totalQuestionBankSize === 1
    ? '1 question total'
    : `${totalQuestionBankSize} questions total`

  return (
    <div className="rounded-2xl flex flex-col items-center border bg-card p-4">
      <div className="flex w-full items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          Selected tiles: <span className="font-semibold text-foreground">{selectedTiles.length}</span> / 6
        </p>
        <Badge variant="secondary" className="text-sm font-medium">
          {totalQuestionBankSizeLabel}
        </Badge>
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
              questionCount={questionCountsByCategoryId[tile.id] ?? 0}
              onDeselect={onDeselect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectedQuestionTiles
