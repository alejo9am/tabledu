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
import CreateQuestionTileSheet from '@/features/boards/routes/BoardCreate/pages/QuestionTiles/CreateQuestionTileSheet'
import { getQuestionTileKey } from '@/features/boards/routes/BoardCreate/pages/QuestionTiles/questionTiles.utils'
import { fetchUserCategories } from '@/services/categories'
import { fetchQuestionCountsByCategoryIds } from '@/services/questions'

function QuestionTilesPage({ form }) {
  const { user } = useAuth()
  const [availableQuestionTiles, setAvailableQuestionTiles] = useState([])
  const [questionCountsByCategoryId, setQuestionCountsByCategoryId] = useState({})
  const [isLoadingQuestionTiles, setIsLoadingQuestionTiles] = useState(true)
  const [search, setSearch] = useState('')
  const [isCreatingNewTile, setIsCreatingNewTile] = useState(false)
  const [newTileName, setNewTileName] = useState('')
  const [newTileIcon, setNewTileIcon] = useState('')
  const [newTileDescription, setNewTileDescription] = useState('')

  const closeCreateTileSheet = () => {
    setIsCreatingNewTile(false)
    setNewTileName('')
    setNewTileIcon('')
    setNewTileDescription('')
  }

  const loadQuestionTiles = useCallback(async () => {
    setIsLoadingQuestionTiles(true)

    try {
      const categories = await fetchUserCategories(user?.id)
      const questionTiles = categories.filter((category) => category.type === 'question')
      setAvailableQuestionTiles(questionTiles)

      const countsByCategoryId = await fetchQuestionCountsByCategoryIds(
        questionTiles.map((tile) => tile.id)
      )
      setQuestionCountsByCategoryId(countsByCategoryId)
    } catch {
      toast.error('Could not load your saved question tiles.')
      setAvailableQuestionTiles([])
      setQuestionCountsByCategoryId({})
    } finally {
      setIsLoadingQuestionTiles(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadQuestionTiles()
  }, [loadQuestionTiles])

  const filteredQuestionTiles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const selectedKeys = new Set(form.selectedQuestionTiles.map((category) => getQuestionTileKey(category)))
    const unselectedTiles = availableQuestionTiles.filter((category) => !selectedKeys.has(getQuestionTileKey(category)))

    if (!normalizedSearch) return unselectedTiles
    return unselectedTiles.filter((category) => category.name.toLowerCase().includes(normalizedSearch))
  }, [availableQuestionTiles, form.selectedQuestionTiles, search])

  const selectQuestionTile = (category) => {
    if (form.selectedQuestionTiles.length >= 6) {
      toast.error('Select no more than 6 question tiles.')
      return
    }

    form.setSelectedQuestionTiles((current) => [...current, category])
  }

  const deselectQuestionTile = (category) => {
    const categoryKey = getQuestionTileKey(category)
    form.setSelectedQuestionTiles((current) => current.filter((item) => getQuestionTileKey(item) !== categoryKey))
  }

  const createQuestionTile = () => {
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

    const newQuestionTile = {
      id: null,
      localId: `question-tile-${Date.now()}`,
      type: 'question',
      name: trimmedName,
      icon: newTileIcon,
      description: trimmedDescription,
    }

    setAvailableQuestionTiles((current) => [...current, newQuestionTile])

    if (form.selectedQuestionTiles.length < 6) {
      form.setSelectedQuestionTiles((current) => [...current, newQuestionTile])
    } else {
      toast.message('Tile created. Select it later by removing another selected tile.')
    }

    closeCreateTileSheet()
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
        <BoardCreateStepTitle currentStep={3} />

        <QuestionScoringPanel
          scoreCorrect={form.scoreCorrect}
          scoreIncorrect={form.scoreIncorrect}
          onScoreCorrectChange={form.setScoreCorrect}
          onScoreIncorrectChange={form.setScoreIncorrect}
        />

        <section className="space-y-4 lg:col-span-2">
          <SelectedQuestionTiles
            selectedTiles={form.selectedQuestionTiles}
            questionCountsByCategoryId={questionCountsByCategoryId}
            onDeselect={deselectQuestionTile}
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
            <Button type="button" variant="warning" onClick={() => setIsCreatingNewTile(true)}>
              <Icon icon={AddSquareIcon} className="size-4" />
              Create tile
            </Button>
          </div>

          <AvailableQuestionTilesList
            isLoading={isLoadingQuestionTiles}
            availableTiles={filteredQuestionTiles}
            hasAnyQuestionTiles={availableQuestionTiles.length > 0}
            onSelect={selectQuestionTile}
            onCreateTile={() => setIsCreatingNewTile(true)}
          />

          <CreateQuestionTileSheet
            open={isCreatingNewTile}
            name={newTileName}
            icon={newTileIcon}
            description={newTileDescription}
            onOpenChange={(open) => {
              if (open) {
                setIsCreatingNewTile(true)
                return
              }

              closeCreateTileSheet()
            }}
            onNameChange={setNewTileName}
            onIconChange={setNewTileIcon}
            onDescriptionChange={setNewTileDescription}
            onCreate={createQuestionTile}
          />
        </section>
      </div>
    </div>
  )
}

export default QuestionTilesPage
