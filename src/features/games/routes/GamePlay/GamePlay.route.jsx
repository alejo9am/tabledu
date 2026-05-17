import { Icon } from '@/components/ui/Icon'
import { Loading02Icon } from '@hugeicons/core-free-icons'
import ErrorState from '@/components/ui/error-state'

import Header from './components/Header'
import BoardGrid from './components/BoardGrid'
import BoardSidebar from './components/BoardSidebar'
import QuestionModal from './components/QuestionModal'
import ChallengeModal from './components/ChallengeModal'
import GameOverModal from './components/GameOverModal'

import { GameProvider, useGame } from '@/features/games/routes/GamePlay/context/GameContext'

function GameLoader({ children }) {
  const { isLoading, loadError, game } = useGame()

  const hasInvalidRuntimeState = !isLoading
    && !loadError
    && (
      game?.status !== 'playing'
      || !game?.current_team_id
    )

  if (isLoading) {
    return (
      <main className="w-screen h-screen flex items-center justify-center">
        <Icon className='animate-spin text-border-dark' icon={Loading02Icon} />
      </main>
    )
  }
  if (loadError) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-6 animate-in fade-in zoom-in" aria-label="Error loading game">
        <ErrorState
          title="We could not load the board"
          description="Something went wrong while fetching the game data. Please check your connection and try again."
          technicalDetails={loadError}
          showSecondaryAction
        />
      </main>
    )
  }
  if (hasInvalidRuntimeState) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-6 animate-in fade-in zoom-in" aria-label="Invalid game state">
        <ErrorState
          title="This game is not ready to play"
          description="Only games in playing status with an active team can be opened in runtime."
          technicalDetails={`status=${game?.status ?? 'unknown'}, active_team=${game?.current_team_id ? 'set' : 'missing'}`}
          showSecondaryAction
        />
      </main>
    )
  }
  return children

}

function BoardPageContent() {
  return (
    <main className="flex min-h-dvh flex-col max-w-screen animate-in zoom-in fade-in" aria-label="Game screen">
      <Header className='flex h-[clamp(88px,14vh,156px)] items-center justify-center px-6' />

      <section
        className="flex min-h-0 flex-1 flex-col gap-8 px-4 pb-4 lg:h-[calc(100dvh-clamp(88px,14vh,156px))] lg:flex-none lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)] lg:gap-8 lg:px-8 lg:pb-6"
        aria-label="Main game area"
      >
        <div className="flex min-h-0 min-w-0 items-center justify-center">
          <BoardGrid className="aspect-54/48 max-h-[calc(100dvh-clamp(88px,14vh,156px)-3rem)] w-[min(100%,calc((100dvh-clamp(88px,14vh,156px)-3rem)*54/48))]" />
        </div>
        <BoardSidebar className='flex h-full min-h-0 w-full flex-col items-center' />
      </section>

      <QuestionModal />
      <ChallengeModal />
      <GameOverModal />
    </main>
  )
}

function BoardPage() {
  return (
    <GameProvider>
      <GameLoader>
        <BoardPageContent />
      </GameLoader>
    </GameProvider>
  )
}

export default BoardPage
