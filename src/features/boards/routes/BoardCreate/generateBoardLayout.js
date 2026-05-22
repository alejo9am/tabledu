const BOARD_TILE_COUNT = 29
const SPECIAL_INTERVAL = 4

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
  let lastTileWasSpecial = false

  return Array.from({ length: BOARD_TILE_COUNT }, (_, index) => {
    const position = index + 1
    const shouldUseSpecial = specialTilePool.length > 0
      && position % SPECIAL_INTERVAL === 0
      && !lastTileWasSpecial

    if (shouldUseSpecial) {
      const tile = specialTilePool[specialIndex % specialTilePool.length]
      specialIndex += 1
      lastTileWasSpecial = true

      return {
        position,
        tile,
      }
    }

    const tile = questionTilePool[questionIndex % questionTilePool.length]
    questionIndex += 1
    lastTileWasSpecial = false

    return {
      position,
      tile,
    }
  })
}
