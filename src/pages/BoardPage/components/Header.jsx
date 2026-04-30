import { useGame } from '../context/GameContext'

const Header = ({ className }) => {
  const { board } = useGame()

  return (
    <header className={className} aria-label="Game header">
      <h1 className="text-3xl md:text-4xl font-display font-extrabold text-primary">{board.name.toUpperCase()}</h1>
    </header>
  );
}

export default Header;