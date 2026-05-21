import { useEffect } from 'react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import BoardCreateStepTitle from '@/features/boards/routes/BoardCreate/components/BoardCreateStepTitle'
import SpecialTileCard from '@/features/boards/routes/BoardCreate/pages/SpecialTiles/SpecialTileCard'

function SpecialTilesPage({ form }) {
  const { specialTiles, isLoadingSpecialTiles, loadSpecialTiles } = form

  useEffect(() => {
    loadSpecialTiles().catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Could not load your saved special tiles. Defaults are available.')
    })
  }, [loadSpecialTiles])

  return (
    <div className="space-y-4">
      <BoardCreateStepTitle currentStep={2} />

      <div className="grid gap-4 xl:grid-cols-3">
        {isLoadingSpecialTiles ? (
          <>
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
          </>
        ) : (
          <>
            <SpecialTileCard
              tile={specialTiles.challenge}
              onChange={(updates) => form.updateSpecialTile('challenge', updates)}
            />
            <SpecialTileCard
              tile={specialTiles.attack}
              onChange={(updates) => form.updateSpecialTile('attack', updates)}
            />
            <SpecialTileCard
              tile={specialTiles.pipe}
              onChange={(updates) => form.updateSpecialTile('pipe', updates)}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default SpecialTilesPage
