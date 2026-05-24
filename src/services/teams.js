import { supabase } from '@/lib/supabase'
import { throwIfSupabaseError } from '@/services/core/errors'

/** Fetch teams for one game. */
export const fetchTeamsByGameId = async (gameId) => {
  if (!gameId) {
    throw new Error('[supabase] Failed to fetch teams: missing game id')
  }

  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('game_id', gameId)
    .order('id', { ascending: true })

  throwIfSupabaseError(error, 'teams')
  return data ?? []
}

/** Update one team within a game. */
export const updateTeamById = async ({ teamId, gameId, updates }) => {
  if (!teamId) {
    throw new Error('[supabase] Failed to update team: missing team id')
  }
  if (!gameId) {
    throw new Error('[supabase] Failed to update team: missing game id')
  }

  const { data, error } = await supabase
    .from('teams')
    .update(updates)
    .eq('id', teamId)
    .eq('game_id', gameId)
    .select('*')
    .maybeSingle()

  throwIfSupabaseError(error, 'teams', 'update')
  if (!data) {
    return null
  }

  return data
}

/** Create teams. Requires target gameId. */
export const createTeams = async ({ gameId, teams }) => {
  if (!gameId) {
    throw new Error('[supabase] Failed to create teams: missing game id')
  }
  if (!Array.isArray(teams) || teams.length === 0) {
    throw new Error('[supabase] Failed to create teams: missing team definitions')
  }

  for (const team of teams) {
    if (!team?.color) {
      throw new Error('[supabase] Failed to create teams: missing team color')
    }
  }

  const payload = teams.map((team) => ({
    name: team.name,
    color: team.color,
    members: Array.isArray(team.members) ? team.members : [],
    game_id: gameId,
  }))

  const { data, error } = await supabase
    .from('teams')
    .insert(payload)
    .select('*')

  throwIfSupabaseError(error, 'teams', 'create')
  return data ?? []
}
