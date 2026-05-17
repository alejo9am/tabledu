import { useGame } from '../context/GameContext'
import BackButton from '@/components/navigation/BackButton'
import { TURN_PHASES } from '../constants/turnPhases'
import { usePreventGameExit } from '../hooks/usePreventGameExit'

const Header = ({ className }) => {
  const { board, turnPhase } = useGame()
  const canLeaveGame = turnPhase === TURN_PHASES.IDLE
  usePreventGameExit(!canLeaveGame)

  return (
    <header className={`${className} relative`} aria-label="Game header">
      <BackButton
        fallbackTo="/games"
        label="Back"
        variant="secondary"
        className="absolute left-2 top-1/2 -translate-y-1/2 sm:left-4"
        disabled={!canLeaveGame}
      />
      <h1 className="text-3xl md:text-4xl font-display font-extrabold text-primary">{board.name.toUpperCase()}</h1>
    </header>
  );
}

export default Header;
