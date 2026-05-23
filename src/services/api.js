import { fetchBoardById } from '@/services/boards'
import { createGame, fetchGameById, updateGameById } from '@/services/games'
import { createTeams, fetchTeamsByGameId, updateTeamById } from '@/services/teams'
import { createAnswer, fetchAnswersByGameId } from '@/services/answers'
import { fetchBoardTiles } from '@/services/tiles'
import { fetchBoardLayout } from '@/services/boardLayouts'
import { fetchQuestionsByBoardId } from '@/services/questions'
import { getTileIconPublicUrl } from '@/services/storage'

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
  fetchBoardTiles,
  fetchBoardLayout,
  fetchQuestionsByBoardId,
  getTileIconPublicUrl,
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

  const [board, teams, answers, layout, tiles, questions] = await Promise.all([
    fetchBoardById(game.board_id),
    fetchTeamsByGameId(gameId),
    fetchAnswersByGameId(gameId),
    fetchBoardLayout(game.board_id),
    fetchBoardTiles(game.board_id),
    fetchQuestionsByBoardId(game.board_id),
  ])

  const questionTileIds = (tiles ?? [])
    .filter((tile) => tile.type === 'question')
    .map((tile) => tile.id)
  const tileIdsWithQuestions = new Set(
    (questions ?? [])
      .map((question) => question.tile_id ?? question.tileId)
      .filter(Boolean)
  )

  let hasQuestionTileWithoutQuestions = false
  for (const tileId of questionTileIds) {
    if (!tileIdsWithQuestions.has(tileId)) {
      hasQuestionTileWithoutQuestions = true
      break
    }
  }

  if (hasQuestionTileWithoutQuestions) {
    throw new Error('BOARD_QUESTIONS_INCOMPLETE::This board has question tiles without questions.')
  }

  if (!board || !game || teams.length === 0 || tiles.length === 0 || layout.length === 0 || questions.length === 0) {
    throw new Error('Incomplete game data, check your board configuration.')
  }

  return { board, game, teams, answers, tiles, layout, questions }
}
