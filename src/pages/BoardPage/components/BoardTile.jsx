function BoardTile({
  tileNumber,
  isGoal = false,
  icon,
  tileLabel,
  teamsOnTile = [],
  isActiveTile = false,
}) {
  return (
    <button
      className={`board-tile${isActiveTile ? ' board-tile--active' : ''}`}
      type="button"
      aria-label={isGoal ? `Goal tile ${tileNumber}` : `${tileLabel} tile ${tileNumber}`}
    >
      <span className="board-tile__number">{tileNumber}</span>
      <span className="board-tile__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="board-tile__label">{tileLabel}</span>
      <span className="board-tile__tokens" aria-label="Teams on this tile">
        {teamsOnTile.map((team) => (
          <span
            key={team.id}
            className={`board-tile__token ${team.slug}`}
            title={team.name}
          />
        ))}
      </span>
    </button>
  )
}

export default BoardTile
