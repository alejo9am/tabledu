import { useCallback, useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import ErrorState from '@/components/ui/error-state'
import BoardCreateStepTitle from '@/features/boards/routes/BoardCreate/components/BoardCreateStepTitle'
import SpecialTileCard from '@/features/boards/routes/BoardCreate/pages/SpecialTiles/SpecialTileCard'

function SpecialTilesPage({ form }) {
  const { specialTiles, isLoadingSpecialTiles, loadSpecialTiles } = form
  const [loadError, setLoadError] = useState(null)
  const genericLoadError = 'Could not load your special tiles.'

  const runLoadSpecialTiles = useCallback(() => {
    setLoadError(null)
    loadSpecialTiles().catch((error) => {
      setLoadError(error instanceof Error ? error.message : genericLoadError)
    })
  }, [loadSpecialTiles])

  useEffect(() => {
    runLoadSpecialTiles()
  }, [runLoadSpecialTiles])

  if (loadError) {
    return (
      <div className="space-y-4">
        <BoardCreateStepTitle currentStep={2} />
        <div className="flex justify-center">
          <ErrorState
            title="Could not load special tiles"
            description="We could not prepare this step. Retry to continue creating your board."
            technicalDetails={loadError === genericLoadError ? null : loadError}
            retryLabel="Retry"
            onRetry={runLoadSpecialTiles}
          />
        </div>
      </div>
    )
  }

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
              tile={specialTiles.duel}
              onChange={(updates) => form.updateSpecialTile('duel', updates)}
            />
            <SpecialTileCard
              tile={specialTiles.penalty}
              onChange={(updates) => form.updateSpecialTile('penalty', updates)}
            />
            <SpecialTileCard
              tile={specialTiles.reroll}
              onChange={(updates) => form.updateSpecialTile('reroll', updates)}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default SpecialTilesPage
