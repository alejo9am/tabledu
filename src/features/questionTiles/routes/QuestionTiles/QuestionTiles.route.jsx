import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AddSquareIcon,
  BubbleChatQuestionIcon,
  DashboardSquare02Icon,
  Alert02Icon,
} from '@hugeicons/core-free-icons'
import { toast } from 'sonner'

import PageHeader from '@/components/layout/PageHeader'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import ErrorState from '@/components/ui/error-state'
import QuestionTileSheet from '@/components/tiles/QuestionTileSheet'
import TilesHelpCard from '@/components/tiles/TilesHelpCard'
import { useAuth } from '@/context/AuthContext'
import useAppNavigation from '@/hooks/useAppNavigation.hook'
import DeleteQuestionTileDialog from '@/features/questionTiles/routes/QuestionTiles/components/DeleteQuestionTileDialog'
import QuestionTilesGrid from '@/features/questionTiles/routes/QuestionTiles/components/QuestionTilesGrid'
import { createTile, deleteTileById, fetchUserQuestionTilesWithCounts, updateTile } from '@/services/tiles'

function QuestionTilesPage() {
  const { goTo } = useAppNavigation()
  const { user, isLoading: isLoadingAuth } = useAuth()

  const [questionTiles, setQuestionTiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newTileName, setNewTileName] = useState('')
  const [newTileIcon, setNewTileIcon] = useState('')
  const [newTileDescription, setNewTileDescription] = useState('')
  const [isTileSheetOpen, setIsTileSheetOpen] = useState(false)
  const [sheetMode, setSheetMode] = useState('create')
  const [tileToEdit, setTileToEdit] = useState(null)
  const [isSavingTile, setIsSavingTile] = useState(false)

  const [tileToDelete, setTileToDelete] = useState(null)
  const [isDeletingTile, setIsDeletingTile] = useState(false)

  const loadQuestionTiles = useCallback(async () => {
    if (isLoadingAuth) return

    setIsLoading(true)
    setError(null)

    try {
      if (!user?.id) {
        setQuestionTiles([])
        return
      }

      const tiles = await fetchUserQuestionTilesWithCounts()
      setQuestionTiles(tiles)
    } catch (error) {
      setQuestionTiles([])
      setError({
        technicalMessage: error?.message ?? null,
      })
    } finally {
      setIsLoading(false)
    }
  }, [isLoadingAuth, user?.id])

  useEffect(() => {
    loadQuestionTiles()
  }, [loadQuestionTiles])

  const sortedQuestionTiles = useMemo(
    () => [...questionTiles].sort((a, b) => a.name.localeCompare(b.name)),
    [questionTiles]
  )

  const closeTileSheet = () => {
    if (isSavingTile) return

    setIsTileSheetOpen(false)
    setSheetMode('create')
    setTileToEdit(null)
    setNewTileName('')
    setNewTileIcon('')
    setNewTileDescription('')
  }

  const openCreateTileSheet = () => {
    setSheetMode('create')
    setTileToEdit(null)
    setNewTileName('')
    setNewTileIcon('')
    setNewTileDescription('')
    setIsTileSheetOpen(true)
  }

  const saveQuestionTile = async () => {
    const trimmedName = newTileName.trim()
    const trimmedDescription = newTileDescription.trim()

    if (!trimmedName) {
      toast.error('Add a name for the new question tile.')
      return
    }

    if (!trimmedDescription) {
      toast.error('Add a description. It helps students understand the topic context.')
      return
    }

    setIsSavingTile(true)

    try {
      if (sheetMode === 'edit') {
        if (!tileToEdit?.id) {
          throw new Error('Missing tile id for edit.')
        }

        const updatedTile = await updateTile({
          tile: {
            id: tileToEdit.id,
            type: tileToEdit.type,
            name: trimmedName,
            icon: newTileIcon,
            description: trimmedDescription,
          },
        })

        const enrichedUpdatedTile = {
          ...updatedTile,
          questionCount: tileToEdit?.questionCount ?? 0,
        }

        setQuestionTiles((current) => current.map((tile) => (
          tile.id === enrichedUpdatedTile.id ? enrichedUpdatedTile : tile
        )))
        toast.success('Question tile updated.')
      } else {
        const createdTile = await createTile({
          tile: {
            type: 'question',
            name: trimmedName,
            icon: newTileIcon,
            description: trimmedDescription,
          },
        })

        setQuestionTiles((current) => [...current, { ...createdTile, questionCount: 0 }])
        toast.success('Question tile created.')
      }

      setIsTileSheetOpen(false)
      setSheetMode('create')
      setTileToEdit(null)
      setNewTileName('')
      setNewTileIcon('')
      setNewTileDescription('')
    } catch (error) {
      const fallbackMessage = sheetMode === 'edit' ? 'Could not update question tile.' : 'Could not create question tile.'
      toast.error(error?.message ?? fallbackMessage)
    } finally {
      setIsSavingTile(false)
    }
  }

  const closeDeleteDialog = () => {
    if (isDeletingTile) return
    setTileToDelete(null)
  }

  const deleteQuestionTile = async () => {
    if (!tileToDelete?.id) return

    setIsDeletingTile(true)
    try {
      await deleteTileById({ tileId: tileToDelete.id })
      setQuestionTiles((current) => current.filter((tile) => tile.id !== tileToDelete.id))
      setTileToDelete(null)
      toast.success('Question tile deleted.')
    } catch (error) {
      toast.error(error?.message ?? 'Could not delete question tile.')
    } finally {
      setIsDeletingTile(false)
    }
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0" aria-label="Question tiles page">
      <PageHeader
        title="Question Tiles"
        description="Create and manage topic-based question banks. Open each tile to manage its individual questions."
        ctaLabel="Create tile"
        ctaSubtitle="Add a new topic bank"
        ctaIcon={AddSquareIcon}
        ctaOnClick={openCreateTileSheet}
      />

      <div className="flex flex-col gap-4">
        <TilesHelpCard
          title="How Question Tiles Work"
          sections={[
            {
              icon: BubbleChatQuestionIcon,
              iconClassName: 'text-warning',
              title: 'Questions Live Inside',
              description: 'Open a tile to add, edit, and organize the individual questions students will answer in gameplay.',
            },
            {
              icon: DashboardSquare02Icon,
              iconClassName: 'text-success',
              title: 'Board Reuse',
              description: 'The same question tile can be reused across multiple boards, so updates to its question bank stay centralized.',
            },
            {
              icon: Alert02Icon,
              iconClassName: 'text-destructive',
              title: 'Delete with Caution',
              description: 'Deleting a question tile permanently removes its full question bank. If the tile is already used in board layouts, remove it from those boards before deleting it here.',
            },
          ]}
        />
        {error ? (
          <div className="flex justify-center">
            <ErrorState
              title="We could not load your question tiles"
              description="Something went wrong while loading your topic containers. Please try again."
              technicalDetails={error.technicalMessage}
              onRetry={loadQuestionTiles}
            />
          </div>
        ) : !isLoading && !sortedQuestionTiles.length ? (
          <div className="flex min-h-[55vh] items-center justify-center">
            <Empty className="w-full max-w-xl rounded-2xl border-3 border-dashed bg-card p-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Icon icon={BubbleChatQuestionIcon} className="size-6 text-primary" />
                </EmptyMedia>
                <EmptyTitle>Create your first question tile</EmptyTitle>
                <EmptyDescription>
                  Start with one topic you teach often. You can add its questions next, then reuse the tile when building classroom boards.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="warning" onClick={openCreateTileSheet}>
                  <Icon icon={AddSquareIcon} className="size-4" />
                  Create first question tile
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <QuestionTilesGrid
            isLoading={isLoading}
            tiles={sortedQuestionTiles}
            isDeletingTile={isDeletingTile}
            onOpenTile={(tileId) => goTo(`/tiles/questions/${tileId}`)}
            onEditTile={(tile) => {
              setSheetMode('edit')
              setTileToEdit(tile)
              setNewTileName(tile.name ?? '')
              setNewTileIcon(tile.icon ?? '')
              setNewTileDescription(tile.description ?? '')
              setIsTileSheetOpen(true)
            }}
            onDeleteTile={(tile) => {
              setTileToDelete(tile)
            }}
          />
        )}
      </div>

      <QuestionTileSheet
        open={isTileSheetOpen}
        mode={sheetMode}
        isSaving={isSavingTile}
        name={newTileName}
        icon={newTileIcon}
        description={newTileDescription}
        onOpenChange={(open) => {
          if (open) {
            setIsTileSheetOpen(true)
            return
          }

          closeTileSheet()
        }}
        onNameChange={setNewTileName}
        onIconChange={setNewTileIcon}
        onDescriptionChange={setNewTileDescription}
        onSave={saveQuestionTile}
      />

      <DeleteQuestionTileDialog
        tile={tileToDelete}
        isDeleting={isDeletingTile}
        onCancel={closeDeleteDialog}
        onConfirm={deleteQuestionTile}
      />
    </section>
  )
}

export default QuestionTilesPage
