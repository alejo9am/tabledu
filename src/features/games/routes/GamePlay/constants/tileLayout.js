export const SPIRAL_COORDINATES = [
  { id: 0, row: 41, column: 1, rowspan: 8, colspan: 6 },
  { id: 1, row: 41, column: 7, rowspan: 8, colspan: 8 },
  { id: 2, row: 41, column: 15, rowspan: 8, colspan: 8 },
  { id: 3, row: 41, column: 23, rowspan: 8, colspan: 8 },
  { id: 4, row: 41, column: 31, rowspan: 8, colspan: 8 },
  { id: 5, row: 41, column: 39, rowspan: 8, colspan: 8 },
  { id: 6, row: 41, column: 47, rowspan: 8, colspan: 8 },
  { id: 7, row: 31, column: 47, rowspan: 10, colspan: 8 },
  { id: 8, row: 20, column: 47, rowspan: 11, colspan: 8 },
  { id: 9, row: 9, column: 47, rowspan: 11, colspan: 8 },
  { id: 10, row: 1, column: 47, rowspan: 8, colspan: 8 },
  { id: 11, row: 1, column: 37, rowspan: 8, colspan: 10 },
  { id: 12, row: 1, column: 28, rowspan: 8, colspan: 9 },
  { id: 13, row: 1, column: 19, rowspan: 8, colspan: 9 },
  { id: 14, row: 1, column: 9, rowspan: 8, colspan: 10 },
  { id: 15, row: 1, column: 1, rowspan: 8, colspan: 8 },
  { id: 16, row: 9, column: 1, rowspan: 11, colspan: 8 },
  { id: 17, row: 20, column: 1, rowspan: 11, colspan: 8 },
  { id: 18, row: 31, column: 1, rowspan: 8, colspan: 8 },
  { id: 19, row: 31, column: 9, rowspan: 8, colspan: 10 },
  { id: 20, row: 31, column: 19, rowspan: 8, colspan: 9 },
  { id: 21, row: 31, column: 28, rowspan: 8, colspan: 9 },
  { id: 22, row: 31, column: 37, rowspan: 8, colspan: 8 },
  { id: 23, row: 20, column: 37, rowspan: 11, colspan: 8 },
  { id: 24, row: 11, column: 37, rowspan: 9, colspan: 8 },
  { id: 25, row: 11, column: 28, rowspan: 8, colspan: 9 },
  { id: 26, row: 11, column: 19, rowspan: 8, colspan: 9 },
  { id: 27, row: 11, column: 11, rowspan: 9, colspan: 8 },
  { id: 28, row: 20, column: 11, rowspan: 9, colspan: 8 },
  { id: 29, row: 21, column: 19, rowspan: 8, colspan: 9 },
  { id: 30, row: 21, column: 28, rowspan: 8, colspan: 7 },
]

export function getTileGridStyle(tileNumber, teamColor) {
  const tile = SPIRAL_COORDINATES.find((coordinate) => coordinate.id === tileNumber)

  const baseStyle = tile
    ? {
      gridRow: `${tile.row} / span ${tile.rowspan}`,
      gridColumn: `${tile.column} / span ${tile.colspan}`
    }
    : {
      gridRow: '1 / span 1',
      gridColumn: '1 / span 1'
    }

  if (!teamColor) {
    return baseStyle
  }

  return {
    ...baseStyle,
    '--team-color': teamColor
  }
}
