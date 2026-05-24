import { Skeleton } from '@/components/ui/skeleton'
import QuestionTileCard from '@/features/tiles/routes/QuestionTiles/components/QuestionTileCard'

function QuestionTilesGrid({
  isLoading,
  tiles,
  isDeletingTile,
  onOpenTile,
  onEditTile,
  onDeleteTile,
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tiles.map((tile) => (
        <QuestionTileCard
          key={tile.id}
          tile={tile}
          isDeleting={isDeletingTile}
          onOpen={onOpenTile}
          onEdit={onEditTile}
          onDelete={onDeleteTile}
        />
      ))}
    </div>
  )
}

export default QuestionTilesGrid
