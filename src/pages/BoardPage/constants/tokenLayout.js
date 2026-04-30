export const CORNER_BY_TILE = {
  6: 'bottomRight',
  10: 'topRight',
  15: 'topLeft',
  22: 'bottomRight',
  24: 'topRight',
  27: 'topLeft',
  30: 'goal'
}

const TOKEN_POSITIONS = {
  1: [{ x: 50, y: 50 }],
  2: [{ x: 32, y: 50 }, { x: 68, y: 50 }],
  3: [{ x: 50, y: 34 }, { x: 32, y: 66 }, { x: 68, y: 66 }],
  4: [{ x: 32, y: 34 }, { x: 68, y: 34 }, { x: 32, y: 66 }, { x: 68, y: 66 }],
  5: [{ x: 32, y: 34 }, { x: 68, y: 34 }, { x: 22, y: 66 }, { x: 50, y: 66 }, { x: 78, y: 66 }],
  6: [{ x: 22, y: 34 }, { x: 50, y: 34 }, { x: 78, y: 34 }, { x: 22, y: 66 }, { x: 50, y: 66 }, { x: 78, y: 66 }],
  7: [{ x: 32, y: 22 }, { x: 68, y: 22 }, { x: 22, y: 50 }, { x: 50, y: 50 }, { x: 78, y: 50 }, { x: 32, y: 78 }, { x: 68, y: 78 }],
  8: [{ x: 32, y: 22 }, { x: 68, y: 22 }, { x: 22, y: 50 }, { x: 50, y: 50 }, { x: 78, y: 50 }, { x: 22, y: 78 }, { x: 50, y: 78 }, { x: 78, y: 78 }]
}

const TOKEN_SIZE_PERCENT_BY_TOTAL_TEAMS = {
  1: 44,
  2: 42,
  3: 40,
  4: 37,
  5: 34,
  6: 31,
  7: 29,
  8: 27
}

const TOKEN_SIZE_SCALE_BY_TOKEN_COUNT = {
  1: 1,
  2: 1,
  3: 0.95,
  4: 0.84,
  5: 0.78,
  6: 0.74,
  7: 0.7,
  8: 0.66
}

export function getTokenPosition(tokenCount, index) {
  return (TOKEN_POSITIONS[tokenCount] ?? TOKEN_POSITIONS[8])[index] ?? { x: 50, y: 50 }
}

export function getTokenSizePx({ tileMinSize, totalTeams, tokenCount }) {
  const baseTokenSizePercent = TOKEN_SIZE_PERCENT_BY_TOTAL_TEAMS[totalTeams] ?? TOKEN_SIZE_PERCENT_BY_TOTAL_TEAMS[8]
  const tokenSizeScale = TOKEN_SIZE_SCALE_BY_TOKEN_COUNT[tokenCount] ?? TOKEN_SIZE_SCALE_BY_TOKEN_COUNT[8]
  const rawTokenSize = tileMinSize * (baseTokenSizePercent / 100) * tokenSizeScale

  return Math.max(12, Math.min(rawTokenSize, 30))
}
