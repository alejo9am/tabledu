import { AddCircleHalfDotIcon, Edit02Icon, HelpSquareIcon, AddSquareIcon } from '@hugeicons/core-free-icons'
import TileCard from '@/components/game/TileCard'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

function AvailableQuestionTile({ tile, onSelect, onEdit }) {
  const questionTile = { ...tile, type: 'question' }

  return (
    <article className="rounded-2xl border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <TileCard tile={questionTile} showShadow={false} className="size-16 shrink-0" />
          <div className="min-w-0">
            <h3 className="truncate font-display text-xl font-semibold text-foreground">{tile.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {tile.description || 'Question bank ready to become a board tile.'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <Button type="button" size="sm" className="w-20" onClick={() => onSelect(tile)}>
            <Icon icon={AddCircleHalfDotIcon} className="size-4" />
            Add
          </Button>
          <Button type="button" variant="secondary" size="sm" className="w-20" onClick={() => onEdit(tile)}>
            <Icon icon={Edit02Icon} className="size-4" />
            Edit
          </Button>
        </div>
      </div>
    </article>
  )
}

function AvailableQuestionTilesList({
  isLoading,
  availableTiles,
  hasAnyQuestionTiles,
  onSelect,
  onEdit,
  onCreateTile,
}) {
  return (
    <ScrollArea className="max-h-112">
      <div className="grid gap-4 pr-3 xl:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </>
        ) : !hasAnyQuestionTiles ? (
          <Empty className="col-span-full mx-auto w-full max-w-md rounded-2xl bg-card border-2 border-dashed p-8">
            <EmptyMedia variant="icon">
              <Icon icon={HelpSquareIcon} className="size-6 text-warning" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="text-base">Create your first question tile</EmptyTitle>
              <EmptyDescription>
                Start by creating the question topics you want on this board. You can add the questions later, and each topic should be completed before gameplay.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button type="button" variant="warning" size="lg" onClick={onCreateTile}>
                <Icon icon={AddSquareIcon} className="size-4" />
                Create question tile
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          availableTiles.map((tile) => (
            <AvailableQuestionTile
              key={tile.id}
              tile={tile}
              onSelect={onSelect}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </ScrollArea>
  )
}

export default AvailableQuestionTilesList
