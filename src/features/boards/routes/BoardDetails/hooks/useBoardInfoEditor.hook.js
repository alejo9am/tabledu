import { useState } from 'react'
import { updateBoardById } from '@/services/boards'

export function useBoardInfoEditor({ board }) {
  // Edit mode + save state
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [isSavingInfo, setIsSavingInfo] = useState(false)

  // Form draft
  const [draftInfo, setDraftInfo] = useState({ name: '', description: '' })

  const startInfoEdit = () => {
    setDraftInfo({
      name: board?.name ?? '',
      description: board?.description ?? '',
    })
    setIsEditingInfo(true)
  }

  const cancelInfoEdit = () => {
    setDraftInfo({ name: '', description: '' })
    setIsEditingInfo(false)
  }

  const updateDraftInfo = (updates) => {
    setDraftInfo((current) => ({ ...current, ...updates }))
  }

  const saveInfo = async () => {
    // Compare trimmed values to avoid unnecessary update calls.
    const nextName = draftInfo.name.trim()
    const nextDescription = draftInfo.description.trim()

    // Safety guard at hook level: never persist empty required fields.
    if (!nextName || !nextDescription) {
      throw new Error('Name and description are required.')
    }

    const currentName = board?.name?.trim?.() ?? ''
    const currentDescription = board?.description?.trim?.() ?? ''

    if (nextName === currentName && nextDescription === currentDescription) {
      setIsEditingInfo(false)
      return { changed: false }
    }

    setIsSavingInfo(true)

    try {
      const updatedBoard = await updateBoardById({
        boardId: board.id,
        updates: {
          name: nextName,
          description: nextDescription,
        },
      })
      setIsEditingInfo(false)
      return { changed: true, board: updatedBoard }
    } finally {
      setIsSavingInfo(false)
    }
  }

  return {
    isEditingInfo,
    isSavingInfo,
    draftInfo,
    startInfoEdit,
    cancelInfoEdit,
    updateDraftInfo,
    saveInfo,
  }
}
