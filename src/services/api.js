import { fetchBoardById } from '@/services/boards'
import { createGame, fetchGameById, updateGameById } from '@/services/games'
import { createTeams, fetchTeamsByGameId, updateTeamById } from '@/services/teams'
import { createAnswer, fetchAnswersByGameId } from '@/services/answers'
import { fetchBoardCategories } from '@/services/categories'
import { fetchBoardLayout } from '@/services/boardCategory'
import { fetchQuestionsByBoardId } from '@/services/questions'
import { getCategoryIconPublicUrl } from '@/services/storage'

export {
  fetchBoardById,
  fetchGameById,
  createGame,
  updateGameById,
  fetchTeamsByGameId,
  createTeams,
  updateTeamById,
  fetchAnswersByGameId,
  createAnswer,
  fetchBoardCategories,
  fetchBoardLayout,
  fetchQuestionsByBoardId,
  getCategoryIconPublicUrl,
}

/** Load runtime entities required to play one game. */
export const fetchGameData = async ({ gameId }) => {
  if (!gameId) {
    throw new Error('[supabase] Failed to load game data: missing game id')
  }

  const game = await fetchGameById(gameId)
  if (!game) {
    throw new Error('Game not found or you do not have access to it.')
  }

  const [board, teams, answers, boardLayout, categories, questions] = await Promise.all([
    fetchBoardById(game.board_id),
    fetchTeamsByGameId(gameId),
    fetchAnswersByGameId(gameId),
    fetchBoardLayout(game.board_id),
    fetchBoardCategories(game.board_id),
    fetchQuestionsByBoardId(game.board_id),
  ])

  if (!board || !game || teams.length === 0 || categories.length === 0 || boardLayout.length === 0 || questions.length === 0) {
    throw new Error('Incomplete game data, check your board configuration.')
  }

  return { board, game, teams, answers, categories, boardCategory: boardLayout, questions }
}
