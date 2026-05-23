import { useState } from 'react'

import { getRandomQuestionForTile } from "@/utils/gameUtils"
import { TURN_PHASES } from '../constants/turnPhases'

export function useGameFlow(gameInfo) {

  // ==========================================
  // DEPENDENCIAS
  // ==========================================

  // Contexto general de la partida
  const {
    board, teams, answers, tiles, layout, questions,
    currentTeam,
    actions: {
      updateTurn, updateScore, updatePosition
    }
  } = gameInfo


  // ==========================================
  // ESTADOS BASE (Fuente de verdad)
  // ==========================================

  const [turnPhase, setTurnPhase] = useState(TURN_PHASES.IDLE)
  const [dieValue, setDieValue] = useState(1)
  const [currentTile, setCurrentTile] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)


  // ==========================================
  // HANDLERS
  // ==========================================
  const nextTurn = () => {
    if (!currentTeam) return

    const currentIndex = teams.findIndex((team) => team.id === currentTeam.id)
    const nextTeam = teams[(currentIndex + 1) % teams.length] ?? teams[0]

    updateTurn(nextTeam.id)
    setCurrentTile(null)
    setCurrentQuestion(null)
    setTurnPhase(TURN_PHASES.IDLE)
  }

  const rollDie = (dieValue) => {
    if ((turnPhase !== TURN_PHASES.IDLE) || !currentTeam) return

    const forcedDieValue = null // DEBUG: cambiar a 7, 30, etc. para forzar tirada, null para normal
    const finalDieValue = forcedDieValue ?? dieValue
    setDieValue(finalDieValue)
    const nextPosition = Math.min(currentTeam.position + finalDieValue, 30)

    updatePosition(currentTeam.id, nextPosition)

    if (nextPosition === 30) {
      setCurrentTile(null)
      setCurrentQuestion(null)
      setTurnPhase(TURN_PHASES.GAME_OVER)
      return
    }

    const tileAtNextPosition = layout.find((tile) => tile.position === nextPosition)
    const nextTileId = tileAtNextPosition?.tileId
    const nextTile = nextTileId
      ? tiles.find((tile) => tile.id === nextTileId) ?? null
      : null
    setCurrentTile(nextTile)

    const nextQuestion = getRandomQuestionForTile(nextTile, questions, answers)
    setCurrentQuestion(nextQuestion)

    setTurnPhase(TURN_PHASES.TILE_INFO)
  }

  const startTileAction = () => {
    switch (currentTile?.type) {
      case 'question':
        setTurnPhase(TURN_PHASES.QUESTION)
        break
      case 'reroll':
        setTurnPhase(TURN_PHASES.IDLE)
        break
      case 'penalty':
        if (!currentTeam) return
        updateScore(currentTeam.id, board.score_attack)
        finishTurn()
        break
      case 'duel':
        setTurnPhase(TURN_PHASES.CHALLENGE)
        break
      default:
        finishTurn()
    }

  }

  const finishTurn = () => {
    if (turnPhase === TURN_PHASES.GAME_OVER) return
    nextTurn()
  }

  return {
    turnPhase, dieValue, currentTile, currentQuestion,
    handlers: {
      nextTurn,
      rollDie,
      startTileAction,
      finishTurn
    }
  }

}
