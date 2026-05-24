import { useCallback, useEffect, useMemo, useState } from 'react'
import { AddSquareIcon, Search01Icon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'

import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'

import { useAuth } from '@/context/AuthContext'
import BoardCreateStepTitle from '@/features/boards/routes/BoardCreate/components/BoardCreateStepTitle'
import QuestionScoringPanel from '@/features/boards/routes/BoardCreate/pages/QuestionTiles/QuestionScoringPanel'
import SelectedQuestionTiles from '@/features/boards/routes/BoardCreate/pages/QuestionTiles/SelectedQuestionTiles'
import AvailableQuestionTilesList from '@/features/boards/routes/BoardCreate/pages/QuestionTiles/AvailableQuestionTilesList'
import QuestionTileSheet from '@/features/tiles/components/QuestionTileSheet'
import { createTile, fetchUserTiles, updateTile } from '@/services/tiles'
import { fetchQuestionCountsByTileIds } from '@/services/questions'

function QuestionTilesPage({ form }) {
  const { user } = useAuth()
  const [availableQuestionTiles, setAvailableQuestionTiles] = useState([])
  const [questionCountsByTileId, setQuestionCountsByTileId] = useState({})
  const [isLoadingQuestionTiles, setIsLoadingQuestionTiles] = useState(true)
  const [search, setSearch] = useState('')
  const [isTileSheetOpen, setIsTileSheetOpen] = useState(false)
  const [sheetMode, setSheetMode] = useState('create')
  const [editingTile, setEditingTile] = useState(null)
  const [isSavingQuestionTile, setIsSavingQuestionTile] = useState(false)
  const [newTileName, setNewTileName] = useState('')
  const [newTileIcon, setNewTileIcon] = useState('')
  const [newTileDescription, setNewTileDescription] = useState('')

  const closeTileSheet = () => {
    setIsTileSheetOpen(false)
    setSheetMode('create')
    setEditingTile(null)
    setNewTileName('')
    setNewTileIcon('')
    setNewTileDescription('')
  }

  const openCreateTileSheet = () => {
    setSheetMode('create')
    setEditingTile(null)
    setNewTileName('')
    setNewTileIcon('')
    setNewTileDescription('')
    setIsTileSheetOpen(true)
  }

  const openEditTileSheet = (tile) => {
    setSheetMode('edit')
    setEditingTile(tile)
    setNewTileName(tile.name ?? '')
    setNewTileIcon(tile.icon ?? '')
    setNewTileDescription(tile.description ?? '')
    setIsTileSheetOpen(true)
  }

  const loadQuestionTiles = useCallback(async () => {
    setIsLoadingQuestionTiles(true)

    try {
      const tiles = await fetchUserTiles(user?.id)
      const questionTiles = tiles.filter((tile) => tile.type === 'question')
      setAvailableQuestionTiles(questionTiles)

      const countsByTileId = await fetchQuestionCountsByTileIds(
        questionTiles.map((tile) => tile.id)
      )
      setQuestionCountsByTileId(countsByTileId)
    } catch {
      toast.error('Could not load your saved question tiles.')
      setAvailableQuestionTiles([])
      setQuestionCountsByTileId({})
    } finally {
      setIsLoadingQuestionTiles(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadQuestionTiles()
  }, [loadQuestionTiles])

  const filteredQuestionTiles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const selectedIds = new Set(form.selectedQuestionTiles.map((tile) => tile.id))
    const unselectedTiles = availableQuestionTiles.filter((tile) => !selectedIds.has(tile.id))

    if (!normalizedSearch) return unselectedTiles
    return unselectedTiles.filter((tile) => tile.name.toLowerCase().includes(normalizedSearch))
  }, [availableQuestionTiles, form.selectedQuestionTiles, search])

  const selectQuestionTile = (tile) => {
    if (form.selectedQuestionTiles.length >= 6) {
      toast.error('Select no more than 6 question tiles.')
      return
    }

    form.updateSelectedQuestionTiles((current) => [...current, tile])
  }

  const deselectQuestionTile = (tile) => {
    form.updateSelectedQuestionTiles((current) => current.filter((item) => item.id !== tile.id))
  }

  const saveQuestionTile = async () => {
    const trimmedName = newTileName.trim()
    const trimmedDescription = newTileDescription.trim()

    if (!trimmedName) {
      toast.error('Add a name for the new question tile.')
      return
    }

    if (!trimmedDescription) {
      toast.error('Add a description. It is shown in gameplay before the question appears.')
      return
    }

    setIsSavingQuestionTile(true)

    try {
      if (sheetMode === 'edit') {
        if (!editingTile?.id) {
          throw new Error('Missing tile id for edit.')
        }

        const updatedQuestionTile = await updateTile({
          tile: {
            ...editingTile,
            name: trimmedName,
            icon: newTileIcon,
            description: trimmedDescription,
          },
        })

        // Update local state with the updated tile
        setAvailableQuestionTiles((current) => current.map((tile) => (
          tile.id === updatedQuestionTile.id ? updatedQuestionTile : tile
        )))
        form.updateSelectedQuestionTiles((current) => current.map((tile) => (
          tile.id === updatedQuestionTile.id ? updatedQuestionTile : tile
        )))

        toast.success('Tile updated.')
      } else {
        const savedQuestionTile = await createTile({
          tile: {
            type: 'question',
            name: trimmedName,
            icon: newTileIcon,
            description: trimmedDescription,
          },
        })

        setAvailableQuestionTiles((current) => [...current, savedQuestionTile])
        if (form.selectedQuestionTiles.length < 6) {
          form.updateSelectedQuestionTiles((current) => [...current, savedQuestionTile])
        } else {
          toast.message('Tile created. Select it later by removing another selected tile.')
        }

        toast.success('Tile created.')
      }

      closeTileSheet()
    } catch {
      toast.error(sheetMode === 'edit' ? 'Could not update tile.' : 'Could not create tile.')
    } finally {
      setIsSavingQuestionTile(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
        <BoardCreateStepTitle currentStep={3} />

        <QuestionScoringPanel
          scores={form.scores}
          onScoresChange={form.updateScores}
        />

        <section className="space-y-4 lg:col-span-2">
          <SelectedQuestionTiles
            selectedTiles={form.selectedQuestionTiles}
            questionCountsByTileId={questionCountsByTileId}
            isLoadingQuestionCounts={isLoadingQuestionTiles}
            onDeselect={deselectQuestionTile}
            onEdit={openEditTileSheet}
          />

          <Separator />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <InputGroup className="sm:max-w-md">
              <InputGroupAddon>
                <InputGroupText>
                  <Icon icon={Search01Icon} className="size-4" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                value={search}
                placeholder="Search available question tiles"
                onChange={(event) => setSearch(event.target.value)}
              />
            </InputGroup>
            <Button type="button" variant="warning" onClick={openCreateTileSheet}>
              <Icon icon={AddSquareIcon} className="size-4" />
              Create tile
            </Button>
          </div>

          <AvailableQuestionTilesList
            isLoading={isLoadingQuestionTiles}
            availableTiles={filteredQuestionTiles}
            hasAnyQuestionTiles={availableQuestionTiles.length > 0}
            onSelect={selectQuestionTile}
            onEdit={openEditTileSheet}
            onCreateTile={openCreateTileSheet}
          />

          <QuestionTileSheet
            open={isTileSheetOpen}
            mode={sheetMode}
            isSaving={isSavingQuestionTile}
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
        </section>
      </div>
    </div>
  )
}

export default QuestionTilesPage
