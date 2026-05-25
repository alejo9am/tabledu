import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChampionIcon, CircleLock01Icon, PaintBoardIcon } from '@hugeicons/core-free-icons'
import PageHeader from '@/components/layout/PageHeader'
import ErrorState from '@/components/ui/error-state'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import TilesHelpCard from '@/components/tiles/TilesHelpCard'
import { useAuth } from '@/context/AuthContext'
import SpecialTileEditCard from '@/features/specialTiles/routes/SpecialTiles/components/SpecialTileEditCard'
import { fetchUserTiles, updateTile } from '@/services/tiles'

function SpecialTilesPage() {
  const { isLoading: isLoadingAuth } = useAuth()
  const [specialTiles, setSpecialTiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const loadSpecialTiles = useCallback(async () => {
    if (isLoadingAuth) return

    setIsLoading(true)
    setLoadError(null)

    try {
      const tiles = await fetchUserTiles()
      const specialTiles = tiles.filter((tile) => tile.type !== 'question')
      const requiredOrder = ['duel', 'penalty', 'reroll']
      const orderedTiles = []

      for (const type of requiredOrder) {
        const match = specialTiles.find((tile) => tile.type === type)
        if (!match) {
          throw new Error('Missing default special tiles for this user. Contact support.')
        }

        orderedTiles.push(match)
      }

      setSpecialTiles(orderedTiles)
    } catch (error) {
      setSpecialTiles([])
      setLoadError(error?.message ?? 'Could not load your special tiles.')
    } finally {
      setIsLoading(false)
    }
  }, [isLoadingAuth])

  useEffect(() => {
    loadSpecialTiles()
  }, [loadSpecialTiles])

  const tileCards = useMemo(
    () => specialTiles.map((tile) => (
      <SpecialTileEditCard
        key={tile.id}
        tile={tile}
        onSave={async (updatedTile) => {
          const persisted = await updateTile({ tile: updatedTile })
          setSpecialTiles((current) => current.map((item) => (item.id === persisted.id ? persisted : item)))
        }}
      />
    )),
    [specialTiles]
  )

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0" aria-label="Special tiles page">
      <PageHeader
        title="Special Tiles"
        description="Special tiles are fixed mechanics provided by Tabledu and shared across all your boards. You can customize their icon, name, and description for your classes."
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <TilesHelpCard
          title="How Special Tiles Work"
          sections={[
            {
              icon: CircleLock01Icon,
              iconClassName: 'text-destructive',
              title: 'Fixed Set',
              description: 'Tabledu provides exactly three special tiles. You cannot create or delete special tile types.',
            },
            {
              icon: PaintBoardIcon,
              iconClassName: 'text-primary',
              title: 'Customizable',
              description: 'Here you can edit each tile\'s icon, name, and description.',
            },
            {
              icon: ChampionIcon,
              iconClassName: 'text-warning',
              title: 'Scoring',
              description: 'Scoring for these mechanics is configured later per board during setup.',
            },
          ]}
        />

        {loadError ? (
          <div className="flex justify-center">
            <ErrorState
              title="Could not load special tiles"
              description="We could not load your platform special tiles. Retry to continue editing them."
              technicalDetails={loadError}
              retryLabel="Retry"
              onRetry={loadSpecialTiles}
            />
          </div>
        ) : null}

        <div className="grid w-full items-start justify-items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-3">
          {isLoading ? (
            <>
              <Skeleton className="h-60 w-full max-w-md rounded-2xl" />
              <Separator orientation="vertical" className="hidden lg:block" />
              <Skeleton className="h-60 w-full max-w-md rounded-2xl" />
              <Separator orientation="vertical" className="hidden lg:block" />
              <Skeleton className="h-60 w-full max-w-md rounded-2xl" />
            </>
          ) : (
            tileCards.flatMap((card, index) => [
              card,
              index < tileCards.length - 1 ? (
                <Separator key={`tile-separator-${index}`} orientation="vertical" className="hidden lg:block" />
              ) : null,
            ])
          )}
        </div>
      </div>

    </section>
  )
}

export default SpecialTilesPage
