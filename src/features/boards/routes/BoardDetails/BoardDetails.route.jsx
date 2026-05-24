import { useParams } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import PageHeader from "@/components/layout/PageHeader"
import useAppNavigation from '@/hooks/useAppNavigation.hook'
import BoardScoringCard from "@/features/boards/routes/BoardDetails/components/BoardScoringCard"
import { fetchBoardById } from "@/services/boards"
import { useAuth } from "@/context/AuthContext"
import ErrorState from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { PlayCircleIcon } from "@hugeicons/core-free-icons"

function BoardDetailsPage() {
  const { boardId } = useParams()
  const { goTo } = useAppNavigation()
  const { user } = useAuth()

  const [board, setBoard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadBoard = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!user?.id || !boardId) {
        setBoard(null)
        return
      }

      const data = await fetchBoardById(boardId)
      setBoard(data)
    } catch (error) {
      setError({
        technicalMessage: error?.message ?? null,
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, boardId])

  useEffect(() => {
    loadBoard()
  }, [loadBoard])

  if (error) {
    // Error while fetching board details (e.g. network error, supabase error, etc.)
    return (
      <section className="flex flex-1 flex-col justify-center items-center gap-4 p-4 pt-0" aria-label="Board details page">
        <ErrorState
          title="We could not load this board"
          description="Something went wrong while fetching the board details. Please try again."
          technicalDetails={error.technicalMessage}
          onRetry={loadBoard}
        />
      </section>
    )
  }

  if (!isLoading && !board) {
    // Board not found or user does not have access to it
    return (
      <section className="flex flex-1 flex-col justify-center items-center gap-4 p-4 pt-0" aria-label="Board details page">
        <ErrorState
          title="Board not found"
          description="This board does not exist or you do not have access to it."
          retryLabel="Go to boards"
          onRetry={() => goTo('/boards')}
        />
      </section>
    )
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0" aria-label="Board details page">
      <PageHeader
        isLoading={isLoading}
        title={board?.name}
        description="Review this board scoring profile and prepare the next game session."
        ctaLabel="Start Game"
        ctaSubtitle="Create a new session"
        ctaIcon={PlayCircleIcon}
        ctaOnClick={() => goTo(`/games/new/${board?.id}`)}
      />
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        <BoardScoringCard board={board} isLoading={isLoading} />

        <article className="rounded-xl border bg-card p-4 sm:p-5 lg:col-span-4">
          <h2 className="text-lg font-semibold sm:text-xl">Tiles</h2>
          <div className="mt-4 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </article>

        <article className="rounded-xl border bg-card p-4 sm:p-5 lg:col-span-7">
          <h2 className="text-lg font-semibold sm:text-xl">Question Bank</h2>
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </article>

        <article className="rounded-xl border bg-card p-4 sm:p-5 lg:col-span-5">
          <h2 className="text-lg font-semibold sm:text-xl">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </article>
      </div>
    </section>
  )
}

export default BoardDetailsPage
