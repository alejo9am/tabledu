import { useEffect, useRef } from 'react'

const MEDALS = ['🥇', '🥈', '🥉']
const RANK_LABELS = ['1st', '2nd', '3rd', '4th']

function GameOverModal({ teams, winnerTeamId }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const ranked = [...teams].sort((a, b) => b.score - a.score)

  const podiumSlots = [
    { team: ranked[1], rank: 2, modifier: 'second' },
    { team: ranked[0], rank: 1, modifier: 'first' },
    { team: ranked[2], rank: 3, modifier: 'third' },
  ]

  return (
    <dialog ref={dialogRef} className="game-over-modal">
      <header className="game-over-modal__header">
        <span className="game-over-modal__trophy" aria-hidden="true">🏆</span>
        <h2 className="game-over-modal__title">Game Over</h2>
        <p className="game-over-modal__subtitle">
          {teams.find((t) => t.id === winnerTeamId)?.name ?? 'A team'} reached the goal first!
        </p>
      </header>

      <div className="game-over-modal__podium" aria-label="Podium">
        {podiumSlots.map(({ team, rank, modifier }) => {
          if (!team) return null
          return (
            <div
              key={team.id}
              className={`game-over-modal__podium-slot game-over-modal__podium-slot--${modifier}`}
            >
              <span className="game-over-modal__medal" aria-hidden="true">{MEDALS[rank - 1]}</span>
              <span
                className={`board-tile__token game-over-modal__podium-token ${team.slug}`}
                title={team.name}
              />
              <span className="game-over-modal__podium-name">{team.name}</span>
              <div className="game-over-modal__podium-block">
                <span className="game-over-modal__podium-rank">{rank}</span>
              </div>
            </div>
          )
        })}
      </div>

      <ul className="game-over-modal__ranking" aria-label="Full ranking">
        {ranked.map((team, i) => (
          <li
            key={team.id}
            className={`game-over-modal__ranking-item${team.id === winnerTeamId ? ' game-over-modal__ranking-item--winner' : ''}`}
          >
            <span className="game-over-modal__ranking-rank">{RANK_LABELS[i]}</span>
            <span className={`board-tile__token ${team.slug}`} title={team.name} />
            <span className="game-over-modal__ranking-name">{team.name}</span>
            {team.id === winnerTeamId && (
              <span className="game-over-modal__winner-badge">🏁 Goal</span>
            )}
            <span className="game-over-modal__ranking-score">{team.score} pts</span>
          </li>
        ))}
      </ul>
    </dialog>
  )
}

export default GameOverModal
