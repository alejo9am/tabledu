import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

import { fetchGameData, updateGameById, updateTeamById, createAnswer } from '@/services/api'

/** Owns runtime game state and persistence actions. */
export function useGameInfo() {
  const { gameId } = useParams()
  const { user } = useAuth()
  // ==========================================
  // ESTADOS BASE (Fuente de verdad)
  // ==========================================

  // Estados para almacenar datos directos de la database
  const [board, setBoard] = useState(null)
  const [game, setGame] = useState(null)
  const [teams, setTeams] = useState([])
  const [answers, setAnswers] = useState([])
  const [tiles, setTiles] = useState([])
  const [layout, setLayout] = useState([])
  const [questions, setQuestions] = useState([])
  // Estados para controlar la carga de datos y errores
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)


  // ==========================================
  // INICIALIZACIÓN (Fetching)
  // ==========================================

  useEffect(() => {
    const loadGameData = async () => {
      try {
        if (!user?.id) {
          throw new Error('Missing authenticated user context. Please sign in again.')
        }

        if (!gameId) {
          throw new Error('Missing game route context. Open this page from a game session.')
        }

        const data = await fetchGameData({ gameId, userId: user.id })
        setBoard(data.board)
        setGame(data.game)
        setTeams(data.teams)
        setAnswers(data.answers)
        setTiles(data.tiles)
        setLayout(data.layout)
        setQuestions(data.questions)
      } catch (error) {
        console.error('[useGameInfo]', error);
        setLoadError(error.message);
      } finally {
        setIsLoading(false)
      }
    }

    loadGameData()
  }, [gameId, user?.id])


  // ==========================================
  // ESTADOS DERIVADOS
  // ==========================================

  const currentTeam = useMemo(() => {
    return teams.find((team) => team.id === game?.current_team_id) ?? null
  }, [teams, game?.current_team_id]) // Recalcula si cambian equipos o el ID del actual

  const questionTiles = useMemo(() => {
    return tiles.filter((tile) => tile.type === 'question')
  }, [tiles]) // Solo se recalcula si cambian las casillas


  // ==========================================
  // ACCIONES (Mutaciones del estado y sincronización con DB)
  // ==========================================

  const updateTurn = async (teamId) => {
    if (!game) return

    const previousTeamId = game.current_team_id

    setGame((previousGame) => ({
      ...previousGame,
      current_team_id: teamId
    }))

    try {
      await updateGameById({ gameId: game.id, userId: user.id, updates: { current_team_id: teamId } })
    } catch (error) {
      console.error('Error al cambiar el turno en la DB:', error)
      setGame((previousGame) => ({
        ...previousGame,
        current_team_id: previousTeamId
      }))
    }
  }

  const updateScore = async (teamId, pointsDelta) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const newScore = team.score + pointsDelta;

    // Actualización del estado local
    setTeams(prevTeams => prevTeams.map(t =>
      t.id === teamId ? { ...t, score: newScore } : t
    ));

    // Sincronizar DB
    try {
      await updateTeamById({ teamId, gameId: game.id, userId: user.id, updates: { score: newScore } })
    } catch (error) {
      console.error("Error al actualizar puntuación:", error);
      // Rollback
      setTeams(prevTeams => prevTeams.map(t =>
        t.id === teamId ? { ...t, score: team.score } : t
      ));
    }
  };

  const updatePosition = async (teamId, newPosition) => {
    const team = teams.find(t => t.id === teamId)
    if (!team) return

    setTeams(prevTeams => prevTeams.map(t =>
      t.id === teamId ? { ...t, position: newPosition } : t
    ))

    try {
      await updateTeamById({ teamId, gameId: game.id, userId: user.id, updates: { position: newPosition } })
    } catch (error) {
      console.error('Error al actualizar posición:', error)
      setTeams(prevTeams => prevTeams.map(t =>
        t.id === teamId ? { ...t, position: team.position } : t
      ))
    }
  }

  const saveAnswer = async ({ questionId, teamId, isCorrect }) => {
    if (!game) return

    const newAnswer = {
      game_id: game.id, // Se obtiene del estado del hook
      question_id: questionId,
      team_id: teamId,
      is_correct: isCorrect
    }

    setAnswers(prev => [...prev, newAnswer])

    try {
      await createAnswer({ answer: newAnswer, userId: user.id })
    } catch (error) {
      console.error('Error al guardar la respuesta:', error)
      // Rollback: Si falla la base de datos, quitamos la respuesta del estado local
      setAnswers(prev => prev.filter(ans =>
        ans.question_id !== questionId || ans.team_id !== teamId
      ));
    }
  }

  return {
    board, game, teams, answers, tiles, layout, questions,
    isLoading, loadError,
    currentTeam, questionTiles,
    actions: {
      updateTurn, updateScore, updatePosition, saveAnswer
    }
  }
}
