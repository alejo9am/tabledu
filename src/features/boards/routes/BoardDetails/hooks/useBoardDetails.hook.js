import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { fetchBoardLayout } from '@/services/boardLayouts'
import { fetchBoardById } from '@/services/boards'
import { fetchPlayingGamesByBoardId } from '@/services/games'
import { fetchQuestionCountsByTileIds } from '@/services/questions'
import { fetchTeamsByGameIds } from '@/services/teams'
import { fetchUserTiles } from '@/services/tiles'
import { useBoardInfoEditor } from '@/features/boards/routes/BoardDetails/hooks/useBoardInfoEditor.hook'
import { useBoardLayoutEditor } from '@/features/boards/routes/BoardDetails/hooks/useBoardLayoutEditor.hook'
import { useBoardScoringEditor } from '@/features/boards/routes/BoardDetails/hooks/useBoardScoringEditor.hook'

/**
 * Builds the Board Details page model from raw entity rows.
 *
 * Input rows come from multiple services:
 * - `board` from boards
 * - `layoutRows` from board_layouts (`{ position, tileId }`)
 * - `games` from games (already filtered to playing sessions)
 * - `teams` from teams (flat array for all fetched game ids)
 * - `userTiles` from tiles (all teacher tiles)
 * - `questionCountsByTileId` from questions (`{ [tileId]: number }`)
 *
 * Returns the normalized shape consumed by BoardDetails UI:
 * {
 *   board: object,
 *   layout: Array<{ position: number, tile: object | null }>,
 *   selectedQuestionTiles: Array<object & { questionCount: number }>,
 *   availableQuestionTiles: Array<object & { questionCount: number }>,
 *   specialTiles: Array<object & { enabled: boolean }>,
 *   sessions: Array<object & { teamCount: number }>
 * }
 */
const buildBoardDetails = ({ board, layoutRows, games, teams, userTiles, questionCountsByTileId }) => {
  if (!board) return null

  const layoutTileIds = layoutRows.map((row) => row.tileId).filter(Boolean)
  const uniqueLayoutTileIds = [...new Set(layoutTileIds)]
  const questionTiles = userTiles.filter((tile) => tile.type === 'question')
  const specialTiles = userTiles.filter((tile) => tile.type !== 'question')
  const tilesById = new Map(userTiles.map((tile) => [tile.id, tile]))
  const teamCountsByGameId = {}
  for (const team of teams ?? []) {
    teamCountsByGameId[team.game_id] = (teamCountsByGameId[team.game_id] ?? 0) + 1
  }

  return {
    board,
    layout: layoutRows.map((row) => ({
      position: row.position,
      tile: tilesById.get(row.tileId) ?? null,
    })),
    selectedQuestionTiles: questionTiles
      .filter((tile) => uniqueLayoutTileIds.includes(tile.id))
      .map((tile) => ({ ...tile, questionCount: questionCountsByTileId[tile.id] ?? 0 })),
    availableQuestionTiles: questionTiles.map((tile) => ({
      ...tile,
      questionCount: questionCountsByTileId[tile.id] ?? 0,
    })),
    specialTiles: specialTiles.map((tile) => ({
      ...tile,
      enabled: uniqueLayoutTileIds.includes(tile.id),
    })),
    sessions: games.map((game) => ({
      ...game,
      teamCount: teamCountsByGameId[game.id] ?? 0,
    })),
  }
}

export function useBoardDetails({ boardId }) {
  const { user } = useAuth()

  // Base page data state
  const [details, setDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load all data needed by this route.
  const loadBoardDetails = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!user?.id || !boardId) {
        setDetails(null)
        return
      }

      const [board, layoutRows, games, userTiles] = await Promise.all([
        fetchBoardById(boardId),
        fetchBoardLayout(boardId),
        fetchPlayingGamesByBoardId(boardId),
        fetchUserTiles(),
      ])

      if (!board) {
        setDetails(null)
        return
      }

      const questionTileIds = userTiles
        .filter((tile) => tile.type === 'question')
        .map((tile) => tile.id)
      const questionCountsByTileId = await fetchQuestionCountsByTileIds(questionTileIds)
      
      const gameIds = games.map((game) => game.id)
      const teams = await fetchTeamsByGameIds(gameIds)

      setDetails(buildBoardDetails({
        board,
        layoutRows,
        games,
        teams,
        userTiles,
        questionCountsByTileId,
      }))
    } catch (loadError) {
      setError({ technicalMessage: loadError?.message ?? null })
    } finally {
      setIsLoading(false)
    }
  }, [boardId, user?.id])

  useEffect(() => {
    loadBoardDetails()
  }, [loadBoardDetails])

  // Section editors (info, scoring, layout)
  const boardInfo = useBoardInfoEditor({ board: details?.board })
  const scoringEditor = useBoardScoringEditor({ board: details?.board })
  const layoutEditor = useBoardLayoutEditor({ details })

  // Save actions
  const handleSaveInfo = async () => {
    try {
      const result = await boardInfo.saveInfo()
      if (!result?.changed) {
        return
      }

      setDetails((current) => {
        if (!current) return current
        return {
          ...current,
          board: {
            ...current.board,
            ...result.board,
          },
        }
      })
      toast.success('Board info updated.')
    } catch (error) {
      toast.error(error?.message ?? 'Could not update board info.')
    }
  }

  const handleSaveScoring = async () => {
    try {
      const result = await scoringEditor.saveScoring()
      if (!result?.changed) {
        return
      }

      setDetails((current) => {
        if (!current) return current
        return {
          ...current,
          board: {
            ...current.board,
            ...result.board,
          },
        }
      })
      toast.success('Scoring rules saved.')
    } catch (error) {
      toast.error(error?.message ?? 'Could not save scoring rules.')
    }
  }

  const handleSaveLayout = async () => {
    try {
      const updatedLayoutState = await layoutEditor.saveLayout()
      if (!updatedLayoutState?.changed) {
        return
      }

      setDetails((current) => {
        if (!current) return current
        return {
          ...current,
          layout: updatedLayoutState.layout,
          selectedQuestionTiles: updatedLayoutState.selectedQuestionTiles,
          specialTiles: updatedLayoutState.specialTiles,
        }
      })
      toast.success('Layout saved.')
    } catch (error) {
      toast.error(error?.message ?? 'Could not save layout changes.')
    }
  }

  return {
    page: {
      details,
      isLoading,
      error,
      reload: loadBoardDetails,
    },
    boardInfo,
    scoringEditor,
    layoutEditor,
    actions: {
      saveInfo: handleSaveInfo,
      saveScoring: handleSaveScoring,
      saveLayout: handleSaveLayout,
    },
  }
}
