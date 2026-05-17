import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import { Skeleton } from '@/components/ui/skeleton'
import BoardCard from '@/components/cards/BoardCard'
import useAppNavigation from '@/hooks/useAppNavigation.hook'
import { useAuth } from '@/context/AuthContext'
import { fetchBoards } from '@/services/boards'
import ErrorState from '@/components/ui/error-state'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { AddCircleIcon, DashboardSquare02Icon } from '@hugeicons/core-free-icons'

function NewGameBoardSelectPage() {
  const { goTo } = useAppNavigation()
  const { user } = useAuth()

  const [boards, setBoards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadBoards = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!user?.id) {
        setBoards([])
        return
      }

      const data = await fetchBoards()
      setBoards(data)
    } catch (err) {
      setError({
        technicalMessage: err instanceof Error ? err.message : null,
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadBoards()
  }, [loadBoards])

  const placeholders = Array.from({ length: 5 }, (_, index) => `loading-${index}`)

  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-4 p-4 pt-6 sm:p-6" aria-label="New game board selection page">
      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <p className="text-sm font-medium text-muted-foreground">New Game</p>
        <h1 className="mt-1 text-2xl font-semibold text-primary sm:text-3xl">Choose a board to start</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Select the board for this session. Team setup happens in the next step.
        </p>
      </div>

      {error ? (
        <div className="flex flex-1 items-center justify-center">
          <ErrorState
            title="We could not load your boards"
            description="Something went wrong while preparing game setup. Please try again."
            technicalDetails={error.technicalMessage}
            onRetry={loadBoards}
          />
        </div>
      ) : null}

      {!error && !isLoading && boards.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <Empty className="w-fit rounded-xl border-2 border-dashed bg-card p-6 md:p-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icon icon={DashboardSquare02Icon} className="size-6" />
              </EmptyMedia>
              <EmptyTitle>No boards yet</EmptyTitle>
              <EmptyDescription>Create a board first, then start your game session setup.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="warning" onClick={() => goTo('/boards/new')}>
                <Icon icon={AddCircleIcon} className="size-4" />
                Create a Board
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      ) : null}

      {!error && (isLoading || boards.length > 0) ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(isLoading ? placeholders : boards).map((item) => {
            if (isLoading) {
              return <Skeleton key={item} className="h-40 w-full rounded-xl" />
            }

            return (
              <BoardCard
                key={item.id}
                board={item}
                primaryActionLabel="Continue setup"
                onPrimaryAction={() => goTo(`/games/new/${item.id}`)}
                secondaryActionLabel="View board"
                onSecondaryAction={() => goTo(`/boards/${item.id}`)}
              />
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

export default NewGameBoardSelectPage
