import { useState } from 'react'

import { getRandomQuestionForCategory } from "@/utils/gameUtils"
import { TURN_PHASES } from '../constants/turnPhases'

export function useGameFlow(gameInfo) {

  // ==========================================
  // DEPENDENCIAS
  // ==========================================

  // Contexto general de la partida
  const {
    board, teams, answers, categories, boardCategory, questions,
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
  const [currentCategory, setCurrentCategory] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)


  // ==========================================
  // HANDLERS
  // ==========================================
  const nextTurn = () => {
    if (!currentTeam) return

    const currentIndex = teams.findIndex((team) => team.id === currentTeam.id)
    const nextTeam = teams[(currentIndex + 1) % teams.length] ?? teams[0]

    updateTurn(nextTeam.id)
    setCurrentCategory(null)
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
      setCurrentCategory(null)
      setCurrentQuestion(null)
      setTurnPhase(TURN_PHASES.GAME_OVER)
      return
    }

    const tileAtNextPosition = boardCategory.find((tile) => tile.position === nextPosition)
    const categoryId = tileAtNextPosition?.category_id
    const nextCategory = categoryId
      ? categories.find((category) => category.id === categoryId) ?? null
      : null
    setCurrentCategory(nextCategory)

    const nextQuestion = getRandomQuestionForCategory(nextCategory, questions, answers)
    setCurrentQuestion(nextQuestion)

    setTurnPhase(TURN_PHASES.TILE_INFO)
  }

  const startTileAction = () => {
    switch (currentCategory?.type) {
      case 'question':
        setTurnPhase(TURN_PHASES.QUESTION)
        break
      case 'special':
        switch (currentCategory.name.toLowerCase()) {
          case 'pipe':
            setTurnPhase(TURN_PHASES.IDLE)
            break
          case 'attack':
            if (!currentTeam) return
            updateScore(currentTeam.id, board.score_attack)
            finishTurn()
            break
          case 'challenge':
            setTurnPhase(TURN_PHASES.CHALLENGE)
            break
        }
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
    turnPhase, dieValue, currentCategory, currentQuestion,
    handlers: {
      nextTurn,
      rollDie,
      startTileAction,
      finishTurn
    }
  }

}