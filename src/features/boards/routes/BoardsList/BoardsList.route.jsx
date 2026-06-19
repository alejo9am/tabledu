import useAppNavigation from '@/hooks/useAppNavigation.hook'
import { useState, useEffect, useCallback } from "react"
import { Icon } from "@/components/ui/Icon"
import PageHeader from "@/components/layout/PageHeader"
import BoardCard from "@/components/cards/BoardCard"
import { fetchBoards } from "@/services/boards"
import { useAuth } from "@/context/AuthContext"
import ErrorState from "@/components/ui/error-state"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { DashboardSquare02Icon, AddCircleIcon } from "@hugeicons/core-free-icons"

function BoardsListPage() {
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
    } catch (error) {
      setError({
        technicalMessage: error?.message ?? null,
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id]) // refetch when authenticated user resolves or changes

  useEffect(() => {
    loadBoards()
  }, [loadBoards])

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <ErrorState
            title="We could not load your boards"
            description="Something went wrong while fetching your boards. Please try again."
            technicalDetails={error.technicalMessage}
            onRetry={loadBoards}
          />
        </div>
      )
    }

    if (!isLoading && boards.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Empty className="w-fit rounded-xl border-3 border-dashed bg-card p-6 md:p-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icon icon={DashboardSquare02Icon} className="size-6" />
              </EmptyMedia>
              <EmptyTitle>No boards yet</EmptyTitle>
              <EmptyDescription>Create a board to start playing with your students.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="warning" onClick={() => goTo('/boards/new')}>
                <Icon icon={AddCircleIcon} className="size-4" />
                Create a Board
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      )
    }

    const placeholders = Array.from({ length: 5 }, (_, index) => ({ id: `loading-${index}` }))
    const items = isLoading ? placeholders : boards

    return (
      <div className="mx-auto grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <BoardCard
            key={item.id}
            board={item}
            isLoading={isLoading}
            onDeleted={(boardId) => setBoards((current) => current.filter((board) => board.id !== boardId))}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0" aria-label="Boards page">
      <PageHeader
        title="Boards"
        description="Manage your boards here."
        ctaLabel="Create Board"
        ctaSubtitle="Build a board for your class"
        ctaIcon={AddCircleIcon}
        ctaOnClick={() => goTo('/boards/new')}
      />
      {renderContent()}
    </section>
  )
}

export default BoardsListPage
