import { useCallback, useEffect, useState } from 'react'
import { ChampionIcon, CircleLock01Icon, PaintBoardIcon } from '@hugeicons/core-free-icons'
import { Skeleton } from '@/components/ui/skeleton'
import ErrorState from '@/components/ui/error-state'
import BoardCreateStepTitle from '@/features/boards/routes/BoardCreate/components/BoardCreateStepTitle'
import SpecialTileCard from '@/features/boards/routes/BoardCreate/pages/SpecialTiles/SpecialTileCard'
import TilesHelpCard from '@/features/tiles/components/TilesHelpCard'

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
      <div className="flex flex-col gap-4">
        <BoardCreateStepTitle currentStep={2} />
        <TilesHelpCard
          title="How Special Tiles Work"
          sections={[
            {
              icon: CircleLock01Icon,
              iconClassName: 'text-destructive',
              title: 'Fixed Set',
              description: 'Tabledu provides exactly three special tiles. You can include or remove them from this board',
            },
            {
              icon: PaintBoardIcon,
              iconClassName: 'text-primary',
              title: 'Shared Customization',
              description: 'Editing a special tile\'s icon, name, or description updates how it appears across all your boards.',
            },
            {
              icon: ChampionIcon,
              iconClassName: 'text-warning',
              title: 'Board Scoring',
              description: 'Special tile scoring is configured per board, so these point values only affect the board you are creating now.',
            },
          ]}
        />

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
              scores={form.scores}
              onChange={(updates) => form.updateSpecialTile('duel', updates)}
              onScoresChange={form.updateScores}
            />
            <SpecialTileCard
              tile={specialTiles.penalty}
              scores={form.scores}
              onChange={(updates) => form.updateSpecialTile('penalty', updates)}
              onScoresChange={form.updateScores}
            />
            <SpecialTileCard
              tile={specialTiles.reroll}
              scores={form.scores}
              onChange={(updates) => form.updateSpecialTile('reroll', updates)}
              onScoresChange={form.updateScores}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default SpecialTilesPage
