import { createContext, useContext } from 'react'
import { useGameInfo } from '../hooks/useGameInfo'
import { useGameFlow } from '../hooks/useGameFlow'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const gameInfo = useGameInfo()
  const gameFlow = useGameFlow(gameInfo)

  const value = {
    ...gameInfo,
    ...gameFlow
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)

  if (context === null) {
    throw new Error('useGame must be used within a GameProvider')
  }

  return context
}