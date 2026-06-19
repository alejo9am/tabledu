import { useCallback, useEffect, useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import useAppNavigation from '@/hooks/useAppNavigation.hook'
import { useAuth } from '@/context/AuthContext'
import { fetchGames } from '@/services/games'
import ErrorState from '@/components/ui/error-state'
import GameCard from '@/components/cards/GameCard'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import { AddCircleIcon, DiceFaces05Icon } from '@hugeicons/core-free-icons'
import BoardSelectorDialog from './BoardSelectorDialog'

function GamesListRoute() {
  const { goTo } = useAppNavigation()
  const { user } = useAuth()

  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBoardSelectorOpen, setIsBoardSelectorOpen] = useState(false)

  const loadGames = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!user?.id) {
        setGames([])
        return
      }

      const data = await fetchGames()
      setGames(data)
    } catch (error) {
      setError({
        technicalMessage: error?.message ?? null,
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadGames()
  }, [loadGames])

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <ErrorState
            title="We could not load your game sessions"
            description="Something went wrong while fetching your games. Please try again."
            technicalDetails={error.technicalMessage}
            onRetry={loadGames}
          />
        </div>
      )
    }

    if (!isLoading && games.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Empty className="w-fit rounded-xl border-3 border-dashed bg-card p-6 md:p-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icon icon={DiceFaces05Icon} className="size-6" />
              </EmptyMedia>
              <EmptyTitle>No game sessions yet</EmptyTitle>
              <EmptyDescription>Create a game from your boards to start playing.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="warning" onClick={() => setIsBoardSelectorOpen(true)}>
                <Icon icon={AddCircleIcon} className="size-4" />
                New Game
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      )
    }

    const placeholders = Array.from({ length: 5 }, (_, index) => ({ id: `loading-${index}` }))
    const items = isLoading ? placeholders : games

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <GameCard
            key={item.id}
            game={item}
            isLoading={isLoading}
            primaryActionLabel="Open Session"
            onPrimaryAction={() => goTo(`/games/${item.id}/play`)}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0" aria-label="Game sessions page">
      <PageHeader
        title="Game Sessions"
        description="Review your sessions or start a new game."
        ctaLabel="New Game"
        ctaSubtitle="Create and configure a session"
        ctaIcon={AddCircleIcon}
        ctaOnClick={() => setIsBoardSelectorOpen(true)}
      />
      {renderContent()}
      <BoardSelectorDialog open={isBoardSelectorOpen} onOpenChange={setIsBoardSelectorOpen} />
    </section>
  )
}

export default GamesListRoute
