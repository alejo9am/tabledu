import { useEffect, useRef, useState } from 'react'
import { ShuffleSquareIcon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import BoardCreateStepTitle from '@/features/boards/routes/BoardCreate/components/BoardCreateStepTitle'
import BoardLayoutPreview from '@/features/boards/routes/BoardCreate/components/BoardLayoutPreview'
import { generateBoardLayout } from '@/features/boards/routes/BoardCreate/generateBoardLayout'
import ReplaceTileDialog from '@/features/boards/routes/BoardCreate/pages/BoardLayout/ReplaceTileDialog'
import useAppNavigation from '@/hooks/useAppNavigation.hook'
import { createBoardLayout } from '@/services/boardLayouts'
import { createBoard } from '@/services/boards'
import { updateTile } from '@/services/tiles'
import { fetchQuestionCountsByTileIds } from '@/services/questions'

function BoardLayoutPage({ form }) {
  const { goTo } = useAppNavigation()
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const hasShownQuestionCountWarningRef = useRef(false)
  const [editingTilePosition, setEditingTilePosition] = useState(null)
  const hasGeneratedLayout = form.generatedLayout.length === 29
  const enabledSpecialTileCount = Object.values(form.specialTiles ?? {}).filter((tile) => tile.enabled).length
  const selectedQuestionTileCount = form.selectedQuestionTiles.length
  const [totalQuestions, setTotalQuestions] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadQuestionTotals = async () => {
      try {
        const selectedIds = form.selectedQuestionTiles.map((tile) => tile.id).filter(Boolean)
        const countsByTileId = await fetchQuestionCountsByTileIds(selectedIds)
        let total = 0
        for (const count of Object.values(countsByTileId)) {
          total += count
        }

        if (isMounted) {
          setTotalQuestions(total)
        }
      } catch {
        if (!hasShownQuestionCountWarningRef.current) {
          toast.warning('Could not load total question count. Showing 0 for now.')
          hasShownQuestionCountWarningRef.current = true
        }

        if (isMounted) {
          setTotalQuestions(0)
        }
      }
    }

    loadQuestionTotals()

    return () => {
      isMounted = false
    }
  }, [form.selectedQuestionTiles])

  const handleGenerateLayout = () => {
    form.setGeneratedLayout(generateBoardLayout({
      questionTiles: form.selectedQuestionTiles,
      specialTiles: form.specialTiles,
    }))
  }

  const handleOpenReplaceTile = (position) => {
    if (!hasGeneratedLayout) return
    setEditingTilePosition(position)
  }

  const handleReplaceTile = (position, nextTile) => {
    form.setGeneratedLayout((currentLayout) => currentLayout.map((tile) => {
      if (tile.position !== position) {
        return tile
      }

      return {
        ...tile,
        tile: nextTile,
      }
    }))
    setEditingTilePosition(null)
  }

  const handleCreateBoard = async () => {
    if (!hasGeneratedLayout) {
      toast.error('Generate a board layout first.')
      return
    }

    setIsCreatingBoard(true)

    try {
      const activeSpecialTiles = Object.values(form.specialTiles).filter((tile) => tile.enabled)
      await Promise.all(activeSpecialTiles.map((tile) => updateTile({ tile })))

      const board = await createBoard({
        board: {
          name: form.name.trim(),
          description: form.description.trim(),
          scoreCorrect: Number(form.scores.scoreCorrect),
          scoreIncorrect: Number(form.scores.scoreIncorrect),
          scoreAttack: Number(form.scores.scoreAttack),
          scoreChallengeWinner: Number(form.scores.scoreChallengeWinner),
          scoreChallengeLoser: Number(form.scores.scoreChallengeLoser),
          scoreChallengeDrawDefender: Number(form.scores.scoreChallengeDrawDefender),
          scoreChallengeDrawAttacker: Number(form.scores.scoreChallengeDrawAttacker),
        },
      })

      if (!board?.id) {
        throw new Error('The board was not created.')
      }

      await createBoardLayout({
        boardId: board.id,
        layout: form.generatedLayout.map((layoutEntry) => {
          if (!layoutEntry.tile?.id) {
            throw new Error(`Tile at board position ${layoutEntry.position} is missing an id.`)
          }

          return {
            position: layoutEntry.position,
            tileId: layoutEntry.tile.id,
          }
        }),
      })

      toast.success('Board created.')
      goTo(`/boards/${board.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unexpected error while creating board')
      setIsCreatingBoard(false)
    }
  }

  return (
    <div className="space-y-4">
      <BoardCreateStepTitle currentStep={4} />

      <div className="grid min-w-0 gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="order-2 min-w-0 lg:order-1">
          <BoardLayoutPreview
            layout={hasGeneratedLayout ? form.generatedLayout : []}
            showGhost={!hasGeneratedLayout}
            onTileClick={handleOpenReplaceTile}
          />
        </section>

        <aside className="order-1 min-w-0 flex flex-col gap-4 rounded-2xl border bg-card p-4 lg:sticky lg:top-4 lg:order-2 sm:p-5">
          <div className="space-y-1">
            <h3 className="font-display text-xl font-semibold">Generate & finalize</h3>
            <p className="text-sm text-muted-foreground">
              Build the path, review the board, and create it when everything looks right.
            </p>
          </div>

          <Button
            type="button"
            variant="warning"
            size="lg"
            className="w-full"
            onClick={handleGenerateLayout}
            disabled={isCreatingBoard}
          >
            <Icon icon={ShuffleSquareIcon} className="size-5" />
            {hasGeneratedLayout ? 'Regenerate layout' : 'Generate layout'}
          </Button>

          <div className="space-y-2 border-y py-3 text-sm">
            <p className="flex items-center justify-between text-muted-foreground">
              <span>Special tiles enabled</span>
              <span className="font-semibold text-foreground">{enabledSpecialTileCount}</span>
            </p>
            <p className="flex items-center justify-between text-muted-foreground">
              <span>Question tiles selected</span>
              <span className="font-semibold text-foreground">{selectedQuestionTileCount}</span>
            </p>
            <p className="flex items-center justify-between text-muted-foreground">
              <span>Total questions available</span>
              <span className="font-semibold text-foreground">{totalQuestions}</span>
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            className="mt-auto w-full"
            onClick={handleCreateBoard}
            disabled={!hasGeneratedLayout || isCreatingBoard}
          >
            <Icon icon={CheckmarkCircle02Icon} className="size-4" />
            {isCreatingBoard ? 'Creating board...' : 'Confirm & Create Board'}
          </Button>

          {!hasGeneratedLayout ? (
            <p className="text-center text-xs text-muted-foreground">
              Generate a layout first to unlock board creation.
            </p>
          ) : null}
        </aside>
      </div>

      <ReplaceTileDialog
        editingTilePosition={editingTilePosition}
        generatedLayout={form.generatedLayout}
        selectedQuestionTiles={form.selectedQuestionTiles}
        specialTiles={form.specialTiles}
        onClose={() => setEditingTilePosition(null)}
        onReplaceTile={handleReplaceTile}
      />
    </div>
  )
}

export default BoardLayoutPage
