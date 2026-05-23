const BOARD_TILE_COUNT = 29
const QUESTION_RUN_OPTIONS = [3, 4]
const SPECIAL_RUN_OPTIONS = [1, 2]

const randomFrom = (options) => options[Math.floor(Math.random() * options.length)]

const shuffle = (items) => {
  const shuffledItems = [...items]

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentItem = shuffledItems[index]
    shuffledItems[index] = shuffledItems[swapIndex]
    shuffledItems[swapIndex] = currentItem
  }

  return shuffledItems
}

export function generateBoardLayout({ questionTiles, specialTiles }) {
  const questionTilePool = shuffle(questionTiles ?? [])
  const specialTilePool = shuffle(
    Object.values(specialTiles ?? {}).filter((tile) => tile.enabled)
  )

  if (questionTilePool.length === 0) return []

  let questionIndex = 0
  let specialIndex = 0
  let runType = 'question'
  let runRemaining = randomFrom(QUESTION_RUN_OPTIONS)

  return Array.from({ length: BOARD_TILE_COUNT }, (_, index) => {
    const position = index + 1
    const canUseSpecial = specialTilePool.length > 0
    const shouldUseSpecial = runType === 'special' && canUseSpecial

    if (shouldUseSpecial) {
      const tile = specialTilePool[specialIndex % specialTilePool.length]
      specialIndex += 1
      runRemaining -= 1

      if (runRemaining === 0) {
        runType = 'question'
        runRemaining = randomFrom(QUESTION_RUN_OPTIONS)
      }

      return {
        position,
        tile,
      }
    }

    const tile = questionTilePool[questionIndex % questionTilePool.length]
    questionIndex += 1
    runRemaining -= 1

    if (runRemaining === 0 && canUseSpecial) {
      runType = 'special'
      runRemaining = randomFrom(SPECIAL_RUN_OPTIONS)
    }

    return {
      position,
      tile,
    }
  })
}
