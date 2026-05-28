export const CORNER_BY_TILE = {
  6: 'bottomRight',
  10: 'topRight',
  15: 'topLeft',
  18: 'bottomLeft',
  22: 'bottomRight',
  24: 'topRight',
  27: 'topLeft',
  28: 'bottomLeft',
  30: 'goal'
}

const TOKEN_POSITIONS = {
  1: [{ x: 50, y: 50 }],
  2: [{ x: 32, y: 50 }, { x: 68, y: 50 }],
  3: [{ x: 50, y: 34 }, { x: 32, y: 66 }, { x: 68, y: 66 }],
  4: [{ x: 32, y: 34 }, { x: 68, y: 34 }, { x: 32, y: 66 }, { x: 68, y: 66 }],
  5: [{ x: 50, y: 20 }, { x: 30, y: 50 }, { x: 70, y: 50 }, { x: 30, y: 80 }, { x: 70, y: 80 }],
  6: [{ x: 30, y: 20 }, { x: 70, y: 20 }, { x: 30, y: 50 }, { x: 70, y: 50 }, { x: 30, y: 80 }, { x: 70, y: 80 }]
}

const TOKEN_SIZE_SCALE_BY_TOKEN_COUNT = {
  1: 1,
  2: 1,
  3: 0.95,
  4: 0.84,
  5: 0.88,
  6: 0.84
}

export function getTokenPosition(tokenCount, index) {
  return (TOKEN_POSITIONS[tokenCount] ?? TOKEN_POSITIONS[6])[index] ?? { x: 50, y: 50 }
}

export function getTokenSizePx({ tileMinSize, tokenCount }) {
  const tokenSizeScale = TOKEN_SIZE_SCALE_BY_TOKEN_COUNT[tokenCount] ?? TOKEN_SIZE_SCALE_BY_TOKEN_COUNT[6]
  const rawTokenSize = 0.33 * tileMinSize * tokenSizeScale

  // Clamp the value to set it between [12px, 30px]
  return Math.max(12, Math.min(rawTokenSize, 30))
}
