import { useCallback, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchUserTiles } from '@/services/tiles'

const hasText = (value) => String(value ?? '').trim().length > 0

const hasNumber = (value) => Number.isFinite(Number(value))

export function useBoardCreateForm() {
  const { user, isLoading: isLoadingAuth } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [specialTiles, setSpecialTiles] = useState(null)
  const [isLoadingSpecialTiles, setIsLoadingSpecialTiles] = useState(true)
  const [scores, setScores] = useState({
    scoreCorrect: 3,
    scoreIncorrect: -1,
    scoreAttack: -2,
    scoreChallengeWinner: 2,
    scoreChallengeLoser: -2,
    scoreChallengeDrawDefender: 0,
    scoreChallengeDrawAttacker: 0,
  })
  const [selectedQuestionTiles, setSelectedQuestionTiles] = useState([])
  const [generatedLayout, setGeneratedLayout] = useState([])
  const [isLayoutStale, setIsLayoutStale] = useState(false)

  const loadSpecialTiles = useCallback(async () => {
    if (specialTiles !== null) {
      setIsLoadingSpecialTiles(false)
      return
    }
    if (isLoadingAuth) return

    setIsLoadingSpecialTiles(true)

    try {
      const tiles = await fetchUserTiles(user?.id)
      const persistedSpecialTiles = tiles.filter((tile) => tile.type !== 'question')
      const penalty = persistedSpecialTiles.find((tile) => tile.type === 'penalty')
      const reroll = persistedSpecialTiles.find((tile) => tile.type === 'reroll')
      const duel = persistedSpecialTiles.find((tile) => tile.type === 'duel')

      if (!penalty || !reroll || !duel) {
        throw new Error('Missing default special tiles for this user. Contact support.')
      }

      setSpecialTiles({
        penalty: { ...penalty, enabled: true },
        reroll: { ...reroll, enabled: true },
        duel: { ...duel, enabled: true },
      })
    } catch {
      setSpecialTiles(null)
      throw new Error('Could not load your special tiles.')
    } finally {
      setIsLoadingSpecialTiles(false)
    }
  }, [isLoadingAuth, specialTiles, user?.id])

  const updateSpecialTile = useCallback((type, updates) => {
    setSpecialTiles((current) => ({
      ...current,           // copies existing tiles
      [type]: {             // updates the specified tile with new values
        ...current[type],   // copies existing values for the tile
        ...updates,         // applies updates to the tile
      },
    }))
    if (generatedLayout.length === 29) {
      setIsLayoutStale(true)
    }
  }, [generatedLayout.length])

  const updateSelectedQuestionTiles = useCallback((updater) => {
    setSelectedQuestionTiles(updater)
    if (generatedLayout.length === 29) {
      setIsLayoutStale(true)
    }
  }, [generatedLayout.length])

  const updateScores = useCallback((updates) => {
    setScores((current) => ({ ...current, ...updates }))
  }, [])

  const markLayoutGenerated = useCallback(() => {
    setIsLayoutStale(false)
  }, [])

  const getStepValidationError = useCallback((step) => {
    if (step === 1) {
      if (!hasText(name)) return 'Add a board name.'
      if (!hasText(description)) return 'Add a board description.'
      return null
    }

    if (step === 2) {
      if (!specialTiles) return 'Special tiles are not ready.'

      for (const [type, tile] of Object.entries(specialTiles)) {
        if (!tile.enabled) continue

        const label = `${ String(type ?? '').charAt(0).toUpperCase()}${ String(type ?? '').slice(1)}` || 'Special tile'
        if (!hasText(tile.name)) return `${label} needs a name.`
        if (!hasText(tile.description)) return `${label} needs a description.`

        if (type === 'penalty' && !hasNumber(scores.scoreAttack)) {
          return 'Penalty needs a valid score value.'
        }

        if (type === 'duel') {
          if (!hasNumber(scores.scoreChallengeWinner)) return 'Duel needs a winner score.'
          if (!hasNumber(scores.scoreChallengeLoser)) return 'Duel needs a loser score.'
          if (!hasNumber(scores.scoreChallengeDrawDefender)) return 'Duel draw needs a defender score.'
          if (!hasNumber(scores.scoreChallengeDrawAttacker)) return 'Duel draw needs an attacker score.'
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
  }, [description, generatedLayout.length, name, scores, selectedQuestionTiles.length, specialTiles])

  return {
    name, setName,
    description, setDescription,
    specialTiles, isLoadingSpecialTiles, updateSpecialTile, loadSpecialTiles,
    scores, updateScores,
    selectedQuestionTiles, updateSelectedQuestionTiles,
    generatedLayout, setGeneratedLayout,
    isLayoutStale, markLayoutGenerated,
    getStepValidationError,
  }
}
