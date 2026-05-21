import { useCallback, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { defaultSpecialTiles, hydrateSpecialTiles } from '@/features/boards/routes/BoardCreate/pages/SpecialTiles/specialTiles.constants'
import { fetchUserCategories } from '@/services/categories'

const hasText = (value) => String(value ?? '').trim().length > 0

const hasNumber = (value) => Number.isFinite(Number(value))

export function useBoardCreateForm() {
  const { user, isLoading: isLoadingAuth } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [specialTiles, setSpecialTiles] = useState(null)
  const [isLoadingSpecialTiles, setIsLoadingSpecialTiles] = useState(true)
  const [scoreCorrect, setScoreCorrect] = useState(3)
  const [scoreIncorrect, setScoreIncorrect] = useState(-1)
  const [selectedQuestionTiles, setSelectedQuestionTiles] = useState([])
  const [generatedLayout, setGeneratedLayout] = useState([])

  const loadSpecialTiles = useCallback(async () => {
    if (specialTiles !== null) {
      setIsLoadingSpecialTiles(false)
      return
    }
    if (isLoadingAuth) return

    setIsLoadingSpecialTiles(true)

    try {
      const tiles = await fetchUserCategories(user?.id)
      const specialTiles = tiles.filter((tile) => tile.type !== 'question')
      setSpecialTiles(hydrateSpecialTiles(specialTiles))
    } catch {
      setSpecialTiles(hydrateSpecialTiles([]))
      throw new Error('Could not load your saved special tiles. Defaults are available.')
    } finally {
      setIsLoadingSpecialTiles(false)
    }
  }, [isLoadingAuth, isLoadingSpecialTiles, specialTiles, user?.id])

  const updateSpecialTile = useCallback((type, updates) => {
    setSpecialTiles((current) => ({
      ...current,           // copies existing categories
      [type]: {             // updates the specified category with new values
        ...current[type],   // copies existing values for the category
        ...updates,         // applies updates to the category
      },
    }))
  }, [])

  const getStepValidationError = useCallback((step) => {
    if (step === 1) {
      if (!hasText(name)) return 'Add a board name.'
      if (!hasText(description)) return 'Add a board description.'
      return null
    }

    if (step === 2) {
      if (!specialTiles) return 'Special tiles are still loading.'

      for (const [type, tile] of Object.entries(specialTiles)) {
        if (!tile.enabled) continue

        const label = defaultSpecialTiles[type].name
        if (!hasText(tile.name)) return `${label} needs a name.`
        if (!hasText(tile.description)) return `${label} needs a description.`
        if (!hasText(tile.icon)) return `${label} needs an icon path.`

        if (type === 'attack' && !hasNumber(tile.scoreAttack)) {
          return 'Attack needs a valid score value.'
        }

        if (type === 'challenge') {
          if (!hasNumber(tile.scoreChallengeWinner)) return 'Challenge needs a winner score.'
          if (!hasNumber(tile.scoreChallengeLoser)) return 'Challenge needs a loser score.'
          if (!hasNumber(tile.scoreChallengeDrawDefender)) return 'Challenge draw needs a defender score.'
          if (!hasNumber(tile.scoreChallengeDrawAttacker)) return 'Challenge draw needs an attacker score.'
        }
      }

      return null
    }

    if (step === 3) {
      if (selectedQuestionTiles.length < 1) return 'Select or create at least 1 question tile.'
      if (selectedQuestionTiles.length > 6) return 'Select no more than 6 question tiles.'
      return null
    }

    if (step === 4) {
      if (generatedLayout.length !== 29) return 'Generate a board layout.'
      return null
    }

    return 'Complete the current step.'
  }, [description, generatedLayout.length, name, selectedQuestionTiles.length, specialTiles])

  return {
    name, setName,
    description, setDescription,
    specialTiles, isLoadingSpecialTiles, updateSpecialTile, loadSpecialTiles,
    scoreCorrect, setScoreCorrect,
    scoreIncorrect, setScoreIncorrect,
    selectedQuestionTiles, setSelectedQuestionTiles,
    generatedLayout, setGeneratedLayout,
    getStepValidationError,
  }
}
