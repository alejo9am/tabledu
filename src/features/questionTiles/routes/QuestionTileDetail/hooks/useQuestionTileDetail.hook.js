import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { toSearchTokens } from '@/lib/search'
import {
  createQuestion,
  deleteQuestionsByIds,
  fetchQuestionsByTileId,
  moveQuestionsToTile,
  updateQuestionById,
} from '@/services/questions'
import { fetchTileById, fetchUserTiles, updateTile } from '@/services/tiles'

function useQuestionTileDetail({ tileId }) {
  // Base resource state for this route.
  const [tile, setTile] = useState(null)
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // Header card drafts/mode (tile metadata editing).
  const [nameDraft, setNameDraft] = useState('')
  const [descriptionDraft, setDescriptionDraft] = useState('')
  const [iconDraft, setIconDraft] = useState('')
  const [isEditingTileHeader, setIsEditingTileHeader] = useState(false)
  const [isIconDialogOpen, setIsIconDialogOpen] = useState(false)
  const [isSavingTileHeader, setIsSavingTileHeader] = useState(false)

  // Client-side table filtering controls.
  const [search, setSearch] = useState('')
  const [answerFilter, setAnswerFilter] = useState('all')

  // Inline edit state for an existing question row.
  const [editingRowId, setEditingRowId] = useState(null)
  const [editingRowText, setEditingRowText] = useState('')
  const [editingRowAnswer, setEditingRowAnswer] = useState(false)
  const [isSavingRow, setIsSavingRow] = useState(false)

  // Draft state for the append-new-question row.
  const [isAddingRow, setIsAddingRow] = useState(false)
  const [newQuestionText, setNewQuestionText] = useState('')
  const [newQuestionAnswer, setNewQuestionAnswer] = useState(true)
  const [isSavingNewQuestion, setIsSavingNewQuestion] = useState(false)

  // Bulk selection + action state.
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([])
  const [isApplyingBulkAction, setIsApplyingBulkAction] = useState(false)
  const [destinationTileId, setDestinationTileId] = useState('')
  const [availableDestinationTiles, setAvailableDestinationTiles] = useState([])
  const [questionIdsToDelete, setQuestionIdsToDelete] = useState([])

  // Keep draft fields in sync with a tile object.
  const syncHeaderDraftsFromTile = (tileValue) => {
    setNameDraft(tileValue?.name ?? '')
    setDescriptionDraft(tileValue?.description ?? '')
    setIconDraft(tileValue?.icon ?? '')
  }

  // Reset the temporary "new question" row to defaults.
  const resetNewQuestionDraft = () => {
    setNewQuestionText('')
    setNewQuestionAnswer(true)
  }

  // ---------------------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------------------
  const loadData = async () => {
    if (!tileId) return

    setIsLoading(true)
    setLoadError(null)

    try {
      const [loadedTile, loadedQuestions, userTiles] = await Promise.all([
        fetchTileById({ tileId }),
        fetchQuestionsByTileId(tileId),
        fetchUserTiles(),
      ])

      if (!loadedTile) {
        throw new Error('Question tile not found.')
      }

      setTile(loadedTile)
      setQuestions(loadedQuestions)
      setAvailableDestinationTiles(
        (userTiles ?? []).filter((questionTile) => questionTile.type === 'question' && questionTile.id !== tileId)
      )
      syncHeaderDraftsFromTile(loadedTile)
      setSelectedQuestionIds([])
    } catch (error) {
      setTile(null)
      setQuestions([])
      setLoadError(error?.message ?? 'Could not load this question tile.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [tileId])

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------
  const filteredQuestions = useMemo(() => {
    const searchTokens = toSearchTokens(search)

    return questions.filter((question) => {
      if (answerFilter === 'true' && !question.answer) return false
      if (answerFilter === 'false' && question.answer) return false
      if (!searchTokens.length) return true

      const questionTokens = toSearchTokens(question.text)
      for (const token of searchTokens) {
        const hasTokenMatch = questionTokens.some((questionToken) => questionToken.includes(token))
        if (!hasTokenMatch) {
          return false
        }
      }

      return true
    })
  }, [questions, search, answerFilter])

  useEffect(() => {
    // Keep selection aligned with current search/filter result.
    // When visible rows change, drop ids that are no longer visible.
    const visibleIds = new Set(filteredQuestions.map((question) => question.id))
    setSelectedQuestionIds((current) => current.filter((id) => visibleIds.has(id)))
  }, [filteredQuestions])

  // True when every row currently visible after search/filter is selected.
  // Used by the header checkbox checked state.
  const allVisibleSelected = useMemo(
    () => Boolean(filteredQuestions.length)
      && filteredQuestions.every((question) => selectedQuestionIds.includes(question.id)),
    [filteredQuestions, selectedQuestionIds]
  )

  // ---------------------------------------------------------------------------
  // Header actions
  // ---------------------------------------------------------------------------
  const beginTileHeaderEdit = () => {
    if (!tile) return
    setIsEditingTileHeader(true)
    syncHeaderDraftsFromTile(tile)
  }

  const cancelTileHeaderEdit = () => {
    if (!tile || isSavingTileHeader) return
    setIsEditingTileHeader(false)
    syncHeaderDraftsFromTile(tile)
  }

  const saveTileHeader = async () => {
    if (!tile) return

    const patch = {
      id: tile.id,
      type: tile.type,
      name: nameDraft.trim(),
      description: descriptionDraft.trim(),
      icon: iconDraft.trim(),
    }

    if (!patch.name) {
      toast.error('Tile name cannot be empty.')
      return
    }
    if (!patch.description) {
      toast.error('Tile description cannot be empty.')
      return
    }

    if (patch.name === tile.name
      && patch.description === tile.description
      && patch.icon === tile.icon) {
      // No changes to save.
      setIsEditingTileHeader(false)
      return
    }

    setIsSavingTileHeader(true)
    try {
      const updatedTile = await updateTile({ tile: patch })
      setTile(updatedTile)
      setIsEditingTileHeader(false)
      syncHeaderDraftsFromTile(updatedTile)
      toast.success('Tile updated.')
    } catch (error) {
      toast.error(error?.message ?? 'Could not update tile.')
    } finally {
      setIsSavingTileHeader(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Row actions
  // ---------------------------------------------------------------------------
  const beginRowEdit = (question) => {
    if (isSavingRow) return
    setEditingRowId(question.id)
    setEditingRowText(question.text ?? '')
    setEditingRowAnswer(Boolean(question.answer))
  }

  const cancelRowEdit = () => {
    if (isSavingRow) return
    setEditingRowId(null)
    setEditingRowText('')
    setEditingRowAnswer(false)
  }

  const confirmRowEdit = async (questionId) => {
    const text = editingRowText.trim()
    if (!text) {
      toast.error('Question text cannot be empty.')
      return
    }

    setIsSavingRow(true)
    try {
      const updated = await updateQuestionById({ questionId, patch: { text, answer: editingRowAnswer } })
      setQuestions((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setEditingRowId(null)
      setEditingRowText('')
      setEditingRowAnswer(false)
      toast.success('Question updated.')
    } catch (error) {
      toast.error(error?.message ?? 'Could not update question.')
    } finally {
      setIsSavingRow(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Add-row actions
  // ---------------------------------------------------------------------------
  const openAddRow = () => {
    setIsAddingRow(true)
    resetNewQuestionDraft()
  }

  const cancelAddRow = () => {
    if (isSavingNewQuestion) return
    setIsAddingRow(false)
    resetNewQuestionDraft()
  }

  const confirmAddRow = async () => {
    const text = newQuestionText.trim()
    if (!text || !tileId) {
      if (!text) toast.error('Question text cannot be empty.')
      return
    }

    setIsSavingNewQuestion(true)
    try {
      const created = await createQuestion({ tileId, text, answer: newQuestionAnswer })
      setQuestions((current) => [...current, created])
      resetNewQuestionDraft()
      setIsAddingRow(false)
      toast.success('Question added.')
    } catch (error) {
      toast.error(error?.message ?? 'Could not create question.')
    } finally {
      setIsSavingNewQuestion(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Selection + bulk actions
  // ---------------------------------------------------------------------------
  const toggleQuestionSelection = (questionId, checked) => {
    setSelectedQuestionIds((current) => {
      if (checked) {
        if (current.includes(questionId)) return current
        return [...current, questionId]
      }
      return current.filter((id) => id !== questionId)
    })
  }

  const toggleSelectAllVisible = (checked) => {
    // Build ids from the *visible* rows only (not all rows in memory).
    // This keeps select-all behavior aligned with active filters/search.
    const visibleQuestionIds = filteredQuestions.map((question) => question.id)

    setSelectedQuestionIds((current) => {
      if (!checked) return current.filter((id) => !visibleQuestionIds.includes(id))
      return [...new Set([...current, ...visibleQuestionIds])]
    })
  }

  const clearSelection = () => {
    setSelectedQuestionIds([])
    setDestinationTileId('')
  }

  // adding any ID to questionIdsToDelete will trigger DeleteDialog open
  const requestDeleteQuestion = (questionId) => {
    if (!questionId) return
    setQuestionIdsToDelete([questionId])
  }

  const cancelDeleteQuestions = () => {
    if (isApplyingBulkAction) return
    setQuestionIdsToDelete([])
  }

  // adding IDs to questionIdsToDelete will trigger DeleteDialog open
  const requestDeleteManyQuestions = () => {
    if (!selectedQuestionIds.length) return
    setQuestionIdsToDelete(selectedQuestionIds)
  }

  const confirmDeleteQuestions = async () => {
    if (!questionIdsToDelete.length) return
    setIsApplyingBulkAction(true)
    try {
      await deleteQuestionsByIds({ questionIds: questionIdsToDelete })
      setQuestions((current) => current.filter((item) => !questionIdsToDelete.includes(item.id)))
      setQuestionIdsToDelete([])
      clearSelection()
      toast.success(questionIdsToDelete.length === 1 ? 'Question deleted.' : 'Selected questions deleted.')
    } catch (error) {
      toast.error(error?.message ?? 'Could not delete questions.')
    } finally {
      setIsApplyingBulkAction(false)
    }
  }

  const applyBulkMove = async () => {
    if (!selectedQuestionIds.length || !destinationTileId) {
      toast.error('Select a destination tile first.')
      return
    }

    setIsApplyingBulkAction(true)
    try {
      await moveQuestionsToTile({ questionIds: selectedQuestionIds, destinationTileId })
      setQuestions((current) => current.filter((item) => !selectedQuestionIds.includes(item.id)))
      clearSelection()
      toast.success('Selected questions moved.')
    } catch (error) {
      toast.error(error?.message ?? 'Could not move selected questions.')
    } finally {
      setIsApplyingBulkAction(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Hook public API (view model)
  // ---------------------------------------------------------------------------
  return {
    tile,
    questions,
    isLoading,
    loadError,
    loadData,
    header: {
      nameDraft, setNameDraft,
      descriptionDraft, setDescriptionDraft,
      iconDraft, setIconDraft,
      isIconDialogOpen, setIsIconDialogOpen,
      isEditingTileHeader,
      isSavingTileHeader,
      beginTileHeaderEdit,
      cancelTileHeaderEdit,
      saveTileHeader,
    },
    toolbar: {
      search, setSearch,
      answerFilter, setAnswerFilter,
      filteredCount: filteredQuestions.length,
      totalCount: questions.length,
    },
    table: {
      filteredQuestions,
      editingRowId,
      editingRowText, setEditingRowText,
      editingRowAnswer, setEditingRowAnswer,
      isSavingRow,
      isAddingRow,
      newQuestionText, setNewQuestionText,
      newQuestionAnswer, setNewQuestionAnswer,
      isSavingNewQuestion,
      allVisibleSelected,
      selectedQuestionIds,
      beginRowEdit,
      cancelRowEdit,
      confirmRowEdit,
      questionIdsToDelete,
      requestDeleteQuestion,
      cancelDeleteQuestions,
      confirmDeleteQuestions,
      openAddRow,
      cancelAddRow,
      confirmAddRow,
      toggleQuestionSelection,
      toggleSelectAllVisible,
    },
    bulk: {
      destinationTileId, setDestinationTileId,
      selectedQuestionIds,
      availableDestinationTiles,
      isApplyingBulkAction,
      requestDeleteManyQuestions,
      clearSelection,
      applyBulkMove,
    },
  }
}

export default useQuestionTileDetail
