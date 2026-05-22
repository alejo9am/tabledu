import { useEffect, useRef, useState } from 'react'
import { ShuffleSquareIcon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import BoardCreateStepTitle from '@/features/boards/routes/BoardCreate/components/BoardCreateStepTitle'
import BoardLayoutPreview from '@/features/boards/routes/BoardCreate/components/BoardLayoutPreview'
import { createCategoryRef, generateBoardLayout } from '@/features/boards/routes/BoardCreate/generateBoardLayout'
import useAppNavigation from '@/hooks/useAppNavigation.hook'
import { createBoardLayout } from '@/services/boardCategory'
import { createBoard } from '@/services/boards'
import { createCategory, upsertCategory } from '@/services/categories'
import { fetchQuestionCountsByCategoryIds } from '@/services/questions'

function BoardLayoutPage({ form }) {
  const { goTo } = useAppNavigation()
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const hasShownQuestionCountWarningRef = useRef(false)
  const hasGeneratedLayout = form.generatedLayout.length === 29
  const enabledSpecialTileCount = Object.values(form.specialTiles ?? {}).filter((tile) => tile.enabled).length
  const selectedQuestionTileCount = form.selectedQuestionTiles.length
  const [totalQuestions, setTotalQuestions] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadQuestionTotals = async () => {
      try {
        const selectedIds = form.selectedQuestionTiles.map((tile) => tile.id).filter(Boolean)
        const countsByCategoryId = await fetchQuestionCountsByCategoryIds(selectedIds)
        let total = 0
        for (const count of Object.values(countsByCategoryId)) {
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
      questionCategories: form.selectedQuestionTiles,
      specialCategories: form.specialTiles,
    }))
  }

  const handleCreateBoard = async () => {
    if (!hasGeneratedLayout) {
      toast.error('Generate a board layout first.')
      return
    }

    setIsCreatingBoard(true)

    try {
      const categoryIdsByRef = new Map(
        form.selectedQuestionTiles
          .filter((category) => category.id)
          .map((category) => [createCategoryRef(category), category.id])
      )
      const activeSpecialCategories = Object.values(form.specialTiles).filter((category) => category.enabled)
      const newQuestionCategories = form.selectedQuestionTiles.filter((category) => !category.id)

      for (const category of activeSpecialCategories) {
        const savedCategory = await upsertCategory({ category })
        categoryIdsByRef.set(createCategoryRef(category), savedCategory.id)
      }

      for (const category of newQuestionCategories) {
        const savedCategory = await createCategory({ category })
        categoryIdsByRef.set(createCategoryRef(category), savedCategory.id)
      }

      const attackCategory = form.specialTiles.attack
      const challengeCategory = form.specialTiles.challenge
      const board = await createBoard({
        board: {
          name: form.name.trim(),
          description: form.description.trim(),
          scoreCorrect: Number(form.scoreCorrect),
          scoreIncorrect: Number(form.scoreIncorrect),
          scoreAttack: Number(attackCategory.scoreAttack),
          scoreChallengeWinner: Number(challengeCategory.scoreChallengeWinner),
          scoreChallengeLoser: Number(challengeCategory.scoreChallengeLoser),
          scoreChallengeDrawDefender: Number(challengeCategory.scoreChallengeDrawDefender),
          scoreChallengeDrawAttacker: Number(challengeCategory.scoreChallengeDrawAttacker),
        },
      })

      if (!board?.id) {
        throw new Error('The board was not created.')
      }

      await createBoardLayout({
        boardId: board.id,
        layout: form.generatedLayout.map((tile) => {
          const categoryId = categoryIdsByRef.get(tile.categoryRef)
          if (!categoryId) {
            throw new Error(`Missing saved category for tile ${tile.position}.`)
          }

          return {
            position: tile.position,
            categoryId,
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
    </div>
  )
}

export default BoardLayoutPage
