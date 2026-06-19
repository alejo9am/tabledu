import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchGames } from '@/services/games'
import { fetchTeamsByGameIds } from '@/services/teams'

function formatRelativeTime(dateValue) {
  // `Intl.RelativeTimeFormat` turns numeric time deltas into labels like
  // "5 minutes ago" or "2 days ago" using the current locale.
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const elapsedSeconds = Math.round((Date.now() - new Date(dateValue).getTime()) / 1000)

  // Pick the largest unit that still keeps the label readable.
  if (elapsedSeconds < 60) {
    return formatter.format(-elapsedSeconds, 'second')
  }

  if (elapsedSeconds < 3600) {
    return formatter.format(-Math.round(elapsedSeconds / 60), 'minute')
  }

  if (elapsedSeconds < 86400) {
    return formatter.format(-Math.round(elapsedSeconds / 3600), 'hour')
  }

  if (elapsedSeconds < 604800) {
    return formatter.format(-Math.round(elapsedSeconds / 86400), 'day')
  }

  return formatter.format(-Math.round(elapsedSeconds / 604800), 'week')
}

function buildGameInfo(game, teams = []) {
  const teamPositions = teams.map((team) => Number(team.position) || 0)
  const progressPercent = Math.round((Math.max(0, ...teamPositions) / 30) * 100)

  const lastPlayedAt = game.updated_at

  return {
    ...game,
    boardName: game?.board?.name ?? 'Unknown board',
    progressPercent,
    lastPlayedAt,
    lastPlayedDiff: formatRelativeTime(lastPlayedAt),
  }
}

export function useGameCards() {
  const { user } = useAuth()
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadGames = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!user?.id) {
        setGames([])
        return
      }

      const gameRows = await fetchGames()
      const gameIds = gameRows.map((game) => game.id).filter(Boolean)
      const teamRows = await fetchTeamsByGameIds(gameIds)

      const teamsByGameId = new Map()
      for (const team of teamRows ?? []) {
        if (!teamsByGameId.has(team.game_id)) {
          teamsByGameId.set(team.game_id, [])
        }
        teamsByGameId.get(team.game_id).push(team)
      }

      setGames(gameRows.map((game) => buildGameInfo(game, teamsByGameId.get(game.id) ?? [])))
    } catch (fetchError) {
      setError({
        technicalMessage: fetchError?.message ?? null,
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadGames()
  }, [loadGames])

  return {
    games,
    isLoading,
    error,
    reload: loadGames,
  }
}
