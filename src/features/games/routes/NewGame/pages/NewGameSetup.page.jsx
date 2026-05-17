import { useCallback, useEffect, useMemo, useState } from 'react'
import { AddCircleHalfDotIcon, Loading02Icon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import BackButton from '@/components/navigation/BackButton'
import CategoryTile from '@/components/game/CategoryTile'
import useAppNavigation from '@/hooks/useAppNavigation.hook'
import ErrorState from '@/components/ui/error-state'
import { fetchBoardById } from '@/services/boards'
import { fetchBoardCategories } from '@/services/categories'
import { createGame, updateGameById } from '@/services/games'
import { createTeams } from '@/services/teams'
import { useAuth } from '@/context/AuthContext'
import TeamsList from '@/features/games/routes/NewGame/components/TeamsList'
import { useTeamsSetup } from '@/features/games/routes/NewGame/hooks/useTeamsSetup'

function NewGameSetupPage({ boardId }) {
  const { goTo } = useAppNavigation()
  const { user } = useAuth()
  const teamsSetup = useTeamsSetup()

  const [board, setBoard] = useState(null)
  const [categories, setCategories] = useState([])
  const [isLoadingBoard, setIsLoadingBoard] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [boardError, setBoardError] = useState(null)
  const [categoriesError, setCategoriesError] = useState(null)
  const [submitIntent, setSubmitIntent] = useState(null)

  const isSubmitting = submitIntent !== null

  const loadBoard = useCallback(async () => {
    setIsLoadingBoard(true)
    setBoardError(null)

    try {
      if (!boardId || !user?.id) {
        setBoard(null)
        return
      }

      const data = await fetchBoardById(boardId)
      setBoard(data)
    } catch (error) {
      setBoardError(error instanceof Error ? error.message : 'Unexpected error')
    } finally {
      setIsLoadingBoard(false)
    }
  }, [boardId, user?.id])

  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true)
    setCategoriesError(null)

    try {
      if (!boardId || !user?.id) {
        setCategories([])
        return
      }

      const data = await fetchBoardCategories(boardId)
      setCategories(data)
    } catch (error) {
      setCategoriesError(error instanceof Error ? error.message : 'Unexpected error')
    } finally {
      setIsLoadingCategories(false)
    }
  }, [boardId, user?.id])

  useEffect(() => {
    loadBoard()
    loadCategories()
  }, [loadBoard, loadCategories])

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (a.type === b.type) return 0
      if (a.type === 'question') return -1
      return 1
    })
  }, [categories])

  const handleCreateSession = async (intent) => {
    if (isSubmitting || !board || !user?.id) {
      return
    }

    const validationError = teamsSetup.validateTeams()
    if (validationError) {
      toast.error(validationError)
      return
    }

    setSubmitIntent(intent)

    try {
      const game = await createGame({
        boardId: board.id,
        userId: user.id,
        status: 'lobby',
      })

      const teamsPayload = teamsSetup.buildTeamsPayload()

      const createdTeams = await createTeams({
        gameId: game.id,
        teams: teamsPayload,
      })

      if (intent === 'play-now') {
        const teamIds = (createdTeams ?? []).map((team) => team.id).filter(Boolean)
        if (!teamIds.length) {
          throw new Error('Could not start game: no teams were created.')
        }

        const randomTeamId = teamIds[Math.floor(Math.random() * teamIds.length)]
        await updateGameById({
          gameId: game.id,
          userId: user.id,
          updates: {
            status: 'playing',
            current_team_id: randomTeamId,
          },
        })

        goTo(`/games/${game.id}/play`)
        return
      }

      goTo('/games')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unexpected error while creating game')
      setSubmitIntent(null)
    }
  }

  const loadError = boardError || categoriesError

  if (loadError) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-6" aria-label="New game setup page">
        <ErrorState
          title="We could not load this setup"
          description="Something went wrong while preparing game setup."
          technicalDetails={loadError}
          onRetry={() => {
            loadBoard()
            loadCategories()
          }}
        />
      </main>
    )
  }

  if (!isLoadingBoard && !board) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-6" aria-label="New game setup page">
        <ErrorState
          title="Board not found"
          description="Select a valid board before starting a new game."
          retryLabel="Go to Boards"
          onRetry={() => goTo('/boards')}
        />
      </main>
    )
  }

  return (
    <main
      className="relative min-h-dvh w-full px-4 pb-8 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-10"
      aria-label="New game setup page"
    >
      <BackButton
        fallbackTo="/games/new"
        label="Back"
        variant="secondary"
        className="fixed left-4 top-4 z-30 sm:left-6 sm:top-6 lg:absolute lg:left-8 lg:top-8"
      />

      <TooltipProvider>
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <section className="flex flex-col justify-center py-2 lg:py-10">
            <div className="space-y-3">
              {isLoadingBoard ? (
                <>
                  <Skeleton className="h-10 w-40 rounded-xl" />
                  <Skeleton className="h-12 w-full max-w-md" />
                  <Skeleton className="h-6 w-full max-w-lg" />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-semibold font-display text-primary sm:text-4xl lg:text-5xl">{board?.name}</h1>
                  <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
                    Review your board and configure your teams. When you are ready, launch immediately or keep this as a lobby.
                  </p>
                </>
              )}
            </div>

            <div className="mt-8">
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Category preview</p>
              {isLoadingCategories ? (
                <div className="mx-auto flex w-62 flex-wrap justify-center gap-2 sm:w-fit sm:grid sm:grid-cols-7 sm:gap-2.5 lg:gap-3">
                  {Array.from({ length: 7 }, (_, index) => (
                    <Skeleton key={`tile-placeholder-${index}`} className="aspect-square w-14 rounded-lg sm:w-16 lg:w-17" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="mx-auto flex w-62 flex-wrap justify-center gap-2 sm:w-fit sm:grid sm:grid-cols-7 sm:gap-2.5 lg:gap-3">
                      {sortedCategories.map((category) => (
                        <div key={category.id} className="aspect-square w-14 sm:w-16 lg:w-17">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="block size-full" aria-label={category.name}>
                                <CategoryTile category={category} className="size-full" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">{category.name}</TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  {!sortedCategories.length ? <p className="mt-3 text-sm text-muted-foreground">No categories configured for this board yet.</p> : null}
                </>
              )}
            </div>

          <div className="mt-8">
            <p className="text-sm text-muted-foreground">Choose how you want to start this game.</p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleCreateSession('play-later')}
                disabled={isLoadingBoard || isSubmitting}
                className="h-11 w-full shadow-sm"
              >
                {submitIntent === 'play-later' ? <Icon icon={Loading02Icon} className="size-4 animate-spin" /> : null}
                {submitIntent === 'play-later' ? 'Saving...' : 'Play Later'}
              </Button>
              <Button
                type="button"
                variant="warning"
                onClick={() => handleCreateSession('play-now')}
                disabled={isLoadingBoard || isSubmitting}
                className="h-11 w-full shadow-sm"
              >
                {submitIntent === 'play-now' ? <Icon icon={Loading02Icon} className="size-4 animate-spin" /> : null}
                {submitIntent === 'play-now' ? 'Starting...' : 'Play Now'}
              </Button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-6 lg:flex lg:max-h-[calc(100dvh-7.5rem)] lg:flex-col lg:p-7">
            <div className="flex items-center justify-between gap-3 lg:sticky lg:top-0 lg:z-10 lg:bg-card lg:pb-3">
              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">Teams</h2>
              </div>
              <Button
                type="button"
                variant="default"
                onClick={teamsSetup.addTeam}
                disabled={isSubmitting || !teamsSetup.canAddTeams}
                className="hidden lg:inline-flex"
              >
                <Icon icon={AddCircleHalfDotIcon} className="size-5" />
                <span>Add team</span>
              </Button>
            </div>

            <Button
              type="button"
              variant="default"
              onClick={teamsSetup.addTeam}
              disabled={isSubmitting || !teamsSetup.canAddTeams}
              className="mt-4 w-full lg:hidden"
            >
              <Icon icon={AddCircleHalfDotIcon} className="size-5" />
              <span>Add team</span>
            </Button>

            <TeamsList
              teamsSetup={teamsSetup}
              isSubmitting={isSubmitting}
            />
          </section>
        </div>
      </TooltipProvider>
    </main>
  )
}

export default NewGameSetupPage
