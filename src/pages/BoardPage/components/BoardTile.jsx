import { useState } from 'react'
import { getCategoryIconPublicUrl } from '../../../utils/supabase'

function BoardTile({
  tileNumber,
  isGoal = false,
  icon,
  tileLabel,
  teamsOnTile = [],
  isActiveTile = false,
}) {
  const [failedIconPath, setFailedIconPath] = useState(null)
  const iconUrl = getCategoryIconPublicUrl(icon)

  return (
    <button
      className={`board-tile${isActiveTile ? ' board-tile--active' : ''}`}
      type="button"
      aria-label={isGoal ? `Goal tile ${tileNumber}` : `${tileLabel} tile ${tileNumber}`}
    >
      <span className="board-tile__number">{tileNumber}</span>
      <span className="board-tile__icon" aria-hidden="true">
        {iconUrl && failedIconPath !== icon ? (
          <img
            className="board-tile__icon-image"
            src={iconUrl}
            alt=""
            loading="lazy"
            onError={() => setFailedIconPath(icon)}
          />
        ) : (
          tileLabel?.charAt(0) ?? '?'
        )}
      </span>
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
