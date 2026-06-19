import { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import ErrorState from '@/components/ui/error-state'
import GameCard from '@/components/cards/GameCard'
import { Skeleton } from '@/components/ui/skeleton'
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
import { useGameCards } from './hooks/useGameCards.hook'
import { useBoardSelectorData } from './hooks/useBoardSelectorData.hook'

function GamesListRoute() {
  const [isBoardSelectorOpen, setIsBoardSelectorOpen] = useState(false)
  const { games, isLoading: isLoadingGames, error, reload: loadGames } = useGameCards()
  const {
    boards,
    isLoading: isLoadingBoards,
    error: boardsError,
    reload: loadBoards,
  } = useBoardSelectorData(isBoardSelectorOpen)
  

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

    if (!isLoadingGames && games.length === 0) {
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

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoadingGames
          ? Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={`loading-${index}`} className="h-36 w-full rounded-xl animate-in fade-in" />
            ))
          : games.map((item) => <GameCard key={item.id} game={item} onDeleted={loadGames} />)}
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
      <BoardSelectorDialog
        open={isBoardSelectorOpen}
        onOpenChange={setIsBoardSelectorOpen}
        boards={boards}
        isLoading={isLoadingBoards}
        error={boardsError}
        onRetry={loadBoards}
      />
    </section>
  )
}

export default GamesListRoute
