import SidebarInfoCard from './SidebarInfoCard'

function BoardSidebar({
  teams,
  currentTeamId,
  onNextTurn,
  onRollDice,
  onStartTileAction,
  diceValue,
  turnPhase,
  currentCategory
}) {

  const actionCardData = (() => {
    if (!currentCategory) {
      return null
    }

    if (currentCategory.type === 'question') {
      return {
        title: `${currentCategory.name} Question`,
        description: currentCategory.description,
        buttonLabel: 'Show question'
      }
    }

    if (currentCategory.type === 'special') {
      return {
        title: `${currentCategory.name} Tile`,
        description: currentCategory.description,
        buttonLabel: 'Continue'
      }
    }

    // Fallback info
    return {
      title: 'Tile event',
      description: 'A tile effect was triggered. Continue to resolve this step.',
      buttonLabel: 'Continue'
    }
  })()

  return (
    <aside className="board-sidebar" aria-label="Sidebar">
      <section className="board-sidebar__section" aria-labelledby="teams-panel-title">
        <h2 id="teams-panel-title">Team security levels</h2>
        <ul className="board-sidebar__team-list">
          {teams.map((team) => (
            <li
              key={team.id}
              className={`
                board-sidebar__team-item 
                ${team.id === currentTeamId ? team.slug : ''}
                ${team.id === currentTeamId ? 'board-sidebar__team-item--active' : ''}`
              }
              aria-current={team.id === currentTeamId ? 'true' : undefined}
            >
              <span className="board-sidebar__team-item-name">
                <span
                  key={team.id}
                  className={`board-tile__token ${team.slug}`}
                  title={team.name}
                />
                <span>{team.name}</span>
              </span>
              <span>{team.score} pts</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="board-sidebar__section board-sidebar__dice-section" aria-labelledby="dice-panel-title">
        {diceValue !== null &&
          <div className="board-sidebar__dice-value">
            <span>{diceValue}</span>
          </div>
        }
        {turnPhase === 'idle' && (
          <button className="board-sidebar__dice-button" type="button" onClick={onRollDice}>
            Roll Dice
          </button>
        )}
      </section>

      {turnPhase === 'tile_info' && actionCardData && (
        <SidebarInfoCard
          sectionAriaLabelId="tile-action-panel-title"
          title={actionCardData.title}
          description={actionCardData.description}
          buttonLabel={actionCardData.buttonLabel}
          onConfirm={onStartTileAction}
        />
      )}

      {turnPhase === 'finished' && (
        <SidebarInfoCard
          sectionAriaLabelId="turn-panel-title"
          title="Go to next turn?"
          buttonLabel="YES"
          onConfirm={onNextTurn}
        />
      )}
    </aside>
  )
}

export default BoardSidebar
