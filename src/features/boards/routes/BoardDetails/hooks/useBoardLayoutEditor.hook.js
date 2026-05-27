import { useState } from 'react'
import { generateBoardLayout } from '@/features/boards/routes/BoardCreate/generateBoardLayout'
import { updateBoardLayout } from '@/services/boardLayouts'

export function useBoardLayoutEditor({ details }) {
  const createDraftTiles = (sourceDetails) => {
    const specialTilesByType = {}
    for (const tile of sourceDetails?.specialTiles ?? []) {
      specialTilesByType[tile.type] = tile
    }

    return {
      questionTiles: sourceDetails?.selectedQuestionTiles ?? [],
      specialTiles: specialTilesByType,
    }
  }

  // ---------------------------------------------------------------------------
  // Draft state
  // ---------------------------------------------------------------------------
  const [isEditingLayout, setIsEditingLayout] = useState(false)
  const [isSavingLayout, setIsSavingLayout] = useState(false)
  const [hasUnsavedLayoutChanges, setHasUnsavedLayoutChanges] = useState(false)
  const [draftLayout, setDraftLayout] = useState([])
  const [draftTiles, setDraftTiles] = useState(() => createDraftTiles(details))

  // Checks if user changed any layout cell compared to the initial state
  const hasLayoutCellChanges = (nextDraftLayout) => {
    for (const draftCell of nextDraftLayout) {
      const initialCell = (details?.layout ?? []).find((layoutCell) => layoutCell.position === draftCell.position)
      const initialTileId = initialCell?.tile?.id ?? null
      const draftTileId = draftCell?.tile?.id ?? null

      if (initialTileId !== draftTileId) {
        return true
      }
    }

    return false
  }

  // ---------------------------------------------------------------------------
  // Draft lifecycle
  // ---------------------------------------------------------------------------
  const startLayoutEdit = () => {
    setDraftLayout(details?.layout ?? [])
    setDraftTiles(createDraftTiles(details))
    setHasUnsavedLayoutChanges(false)
    setIsEditingLayout(true)
  }

  const cancelLayoutEdit = () => {
    setDraftLayout(details?.layout ?? [])
    setDraftTiles(createDraftTiles(details))
    setHasUnsavedLayoutChanges(false)
    setIsEditingLayout(false)
  }

  // ---------------------------------------------------------------------------
  // Draft mutators
  // ---------------------------------------------------------------------------
  const regenerateLayout = (nextTiles = draftTiles) => {
    const nextLayout = generateBoardLayout({
      questionTiles: nextTiles.questionTiles,
      specialTiles: nextTiles.specialTiles,
    })

    setDraftTiles(nextTiles)
    setDraftLayout(nextLayout)
    setHasUnsavedLayoutChanges(hasLayoutCellChanges(nextLayout))
  }

  const updateCell = ({ position, tile }) => {
    setDraftLayout((current) => {
      const nextLayout = current.map((layoutCell) => (
        layoutCell.position === position ? { ...layoutCell, tile } : layoutCell
      ))
      setHasUnsavedLayoutChanges(hasLayoutCellChanges(nextLayout))
      return nextLayout
    })
  }

  const toggleSpecialTile = (type) => {
    const nextTiles = {
      ...draftTiles,
      specialTiles: {
        ...draftTiles.specialTiles,
        [type]: {
          ...draftTiles.specialTiles[type],
          enabled: !draftTiles.specialTiles[type]?.enabled,
        },
      },
    }
    regenerateLayout(nextTiles)
  }

  const addQuestionTile = (tile) => {
    regenerateLayout({
      ...draftTiles,
      questionTiles: [...draftTiles.questionTiles, tile],
    })
  }

  const removeQuestionTile = (tileId) => {
    regenerateLayout({
      ...draftTiles,
      questionTiles: draftTiles.questionTiles.filter((tile) => tile.id !== tileId),
    })
  }

  const swapQuestionTile = ({ currentTileId, nextTile }) => {
    const nextQuestionTiles = draftTiles.questionTiles.map((tile) => (
      tile.id === currentTileId ? nextTile : tile
    ))

    const nextLayout = draftLayout.map((layoutCell) => {
      if (layoutCell.tile?.id !== currentTileId) {
        return layoutCell
      }

      return {
        ...layoutCell,
        tile: nextTile,
      }
    })

    setDraftTiles({
      ...draftTiles,
      questionTiles: nextQuestionTiles,
    })
    setDraftLayout(nextLayout)
    setHasUnsavedLayoutChanges(hasLayoutCellChanges(nextLayout))
  }

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------
  const saveLayout = async () => {
    if (!hasUnsavedLayoutChanges) {
      setIsEditingLayout(false)
      return { changed: false }
    }

    setIsSavingLayout(true)

    try {
      await updateBoardLayout({
        boardId: details.board.id,
        layout: draftLayout.map((layoutCell) => ({
          position: layoutCell.position,
          tileId: layoutCell.tile?.id,
        })),
      })
      setHasUnsavedLayoutChanges(false)
      setIsEditingLayout(false)
      return {
        changed: true,
        layout: draftLayout,
        selectedQuestionTiles: draftTiles.questionTiles,
        specialTiles: Object.values(draftTiles.specialTiles),
      }
    } finally {
      setIsSavingLayout(false)
    }
  }

  return {
    isEditingLayout,
    isSavingLayout,
    hasUnsavedLayoutChanges,
    draftLayout,
    draftTiles,
    startLayoutEdit,
    cancelLayoutEdit,
    saveLayout,
    regenerateLayout,
    updateCell,
    toggleSpecialTile,
    addQuestionTile,
    removeQuestionTile,
    swapQuestionTile,
  }
}
