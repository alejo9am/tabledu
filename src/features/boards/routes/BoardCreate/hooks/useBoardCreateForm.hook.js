import { useCallback, useState } from 'react'

const defaultSpecialCategories = {
  attack: {
    id: null,
    name: 'Attack',
    icon: 'system/hacker.png',
    description: 'Cyber attack! Your team loses points.',
    enabled: true,
    scoreAttack: -5,
  },
  pipe: {
    id: null,
    name: 'Pipe',
    icon: 'system/pipe.png',
    description: 'Lucky break! Roll the dice again.',
    enabled: true,
  },
  challenge: {
    id: null,
    name: 'Challenge',
    icon: 'system/swords.png',
    description: 'Duel time. Challenge a rival team.',
    enabled: true,
    scoreChallengeWinner: 5,
    scoreChallengeLoser: -3,
    scoreChallengeDrawDefender: 1,
    scoreChallengeDrawAttacker: -1,
  },
}

const hasText = (value) => String(value ?? '').trim().length > 0

const hasNumber = (value) => Number.isFinite(Number(value))

export function useBoardCreateForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [specialCategories, setSpecialCategories] = useState(defaultSpecialCategories)
  const [specialCategoriesLoaded, setSpecialCategoriesLoaded] = useState(false)
  const [scoreCorrect, setScoreCorrect] = useState(3)
  const [scoreIncorrect, setScoreIncorrect] = useState(-1)
  const [questionCategories, setQuestionCategories] = useState([])
  const [generatedLayout, setGeneratedLayout] = useState([])

  const hydrateSpecialCategories = useCallback((categories) => {
    // first load the default data
    // then, if user has existing categories, overwrite the defaults with the user's data
    const hydratedAttack = {
      ...defaultSpecialCategories.attack,
      ...((categories ?? []).find((category) => category.type === 'attack') ?? {}),
    }

    const hydratedPipe = {
      ...defaultSpecialCategories.pipe,
      ...((categories ?? []).find((category) => category.type === 'pipe') ?? {}),
    }

    const hydratedChallenge = {
      ...defaultSpecialCategories.challenge,
      ...((categories ?? []).find((category) => category.type === 'challenge') ?? {}),
    }

    setSpecialCategories({
      attack: hydratedAttack,
      pipe: hydratedPipe,
      challenge: hydratedChallenge,
    })
    setSpecialCategoriesLoaded(true)
  }, [])

  const updateSpecialCategory = useCallback((type, updates) => {
    setSpecialCategories((current) => ({
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
      for (const [type, category] of Object.entries(specialCategories)) {
        if (!category.enabled) continue

        const label = defaultSpecialCategories[type].name
        if (!hasText(category.name)) return `${label} needs a name.`
        if (!hasText(category.description)) return `${label} needs a description.`
        if (!hasText(category.icon)) return `${label} needs an icon path.`

        if (type === 'attack' && !hasNumber(category.scoreAttack)) {
          return 'Attack needs a valid score value.'
        }

        if (type === 'challenge') {
          if (!hasNumber(category.scoreChallengeWinner)) return 'Challenge needs a winner score.'
          if (!hasNumber(category.scoreChallengeLoser)) return 'Challenge needs a loser score.'
          if (!hasNumber(category.scoreChallengeDrawDefender)) return 'Challenge draw needs a defender score.'
          if (!hasNumber(category.scoreChallengeDrawAttacker)) return 'Challenge draw needs an attacker score.'
        }
      }

      return null
    }

    if (step === 3) {
      if (questionCategories.length < 1) return 'Select or create at least 1 question tile.'
      if (questionCategories.length > 6) return 'Select no more than 6 question tiles.'
      return null
    }

    if (step === 4) {
      if (generatedLayout.length !== 29) return 'Generate a board layout.'
      return null
    }

    return 'Complete the current step.'
  }, [description, generatedLayout.length, name, questionCategories.length, specialCategories])

  return {
    name,
    setName,
    description,
    setDescription,
    specialCategories,
    specialCategoriesLoaded,
    setSpecialCategoriesLoaded,
    updateSpecialCategory,
    hydrateSpecialCategories,
    scoreCorrect,
    setScoreCorrect,
    scoreIncorrect,
    setScoreIncorrect,
    questionCategories,
    setQuestionCategories,
    generatedLayout,
    setGeneratedLayout,
    getStepValidationError,
  }
}
