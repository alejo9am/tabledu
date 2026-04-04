import BoardTile from './BoardTile'

const BOARD_WIDTH = 6
const BOARD_HEIGHT = 5

const SPIRAL_COORDINATES = [
  { position: 1, row: 4, column: 0 },
  { position: 2, row: 4, column: 1 },
  { position: 3, row: 4, column: 2 },
  { position: 4, row: 4, column: 3 },
  { position: 5, row: 4, column: 4 },
  { position: 6, row: 4, column: 5 },
  { position: 7, row: 3, column: 5 },
  { position: 8, row: 2, column: 5 },
  { position: 9, row: 1, column: 5 },
  { position: 10, row: 0, column: 5 },
  { position: 11, row: 0, column: 4 },
  { position: 12, row: 0, column: 3 },
  { position: 13, row: 0, column: 2 },
  { position: 14, row: 0, column: 1 },
  { position: 15, row: 0, column: 0 },
  { position: 16, row: 1, column: 0 },
  { position: 17, row: 2, column: 0 },
  { position: 18, row: 3, column: 0 },
  { position: 19, row: 3, column: 1 },
  { position: 20, row: 3, column: 2 },
  { position: 21, row: 3, column: 3 },
  { position: 22, row: 3, column: 4 },
  { position: 23, row: 2, column: 4 },
  { position: 24, row: 1, column: 4 },
  { position: 25, row: 1, column: 3 },
  { position: 26, row: 1, column: 2 },
  { position: 27, row: 1, column: 1 },
  { position: 28, row: 2, column: 1 },
  { position: 29, row: 2, column: 2 },
  { position: 30, row: 2, column: 3 },
]

function BoardGrid({ teams, currentTeamId, boardCategory, categories }) {

  const teamsAtStart = teams.filter((team) => team.position === 0)

  // Returns icon and label for each playable tile.
  const getTileContent = (tileNumber) => {
    if (tileNumber === 30) {
      return { icon: 'system/goal.png', label: 'Goal' }
    }
    const tileData = boardCategory.find((tile) => tile.position === tileNumber)
    const category = categories.find((cat) => cat.id === tileData?.category_id)
    return { icon: category?.icon, label: category?.name ?? 'Unknown' }
  }

  return (
    <section className="board-grid" aria-label="Board">

      <div className="board-start-tile" aria-label="Start tile">
        <span className="board-start-tile__label">START</span>
        <span className="board-start-tile__tokens">
          {teamsAtStart.map((team) => (
            <span
              key={team.id}
              className={`board-tile__token ${team.slug}`}
              title={team.name}
            />
          ))}
        </span>
      </div>

      <table className="board-grid__table">
        <tbody>
          {Array(BOARD_HEIGHT).fill(null).map((_, row) => (
            <tr key={row}>
              {Array(BOARD_WIDTH).fill(null).map((_, column) => {
                const coordinate = SPIRAL_COORDINATES.find(
                  (coord) => coord.row === row && coord.column === column,
                )

                if (!coordinate) {
                  return <td key={`empty-${row}-${column}`} className="board-grid__cell" />
                }

                return (
                  <td key={coordinate.position} className="board-grid__cell">
                    <BoardTile
                      tileNumber={coordinate.position}
                      isGoal={coordinate.position === 30}
                      icon={getTileContent(coordinate.position).icon}
                      tileLabel={getTileContent(coordinate.position).label}
                      teamsOnTile={teams.filter((team) => team.position === coordinate.position)}
                      isActiveTile={teams.some(
                        (team) => team.id === currentTeamId && team.position === coordinate.position,
                      )}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default BoardGrid
