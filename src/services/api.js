import { supabase } from '@/lib/supabase'

const CATEGORY_ICONS_BUCKET = 'category-icons'

const TEAMS = [
  { id: 1, slug: 'team-1', name: 'Team 1', score: 0, position: 0, color: '#a855f7' },
  { id: 2, slug: 'team-2', name: 'Team 2', score: 0, position: 0, color: '#68ec68' },
  { id: 3, slug: 'team-3', name: 'Team 3', score: 0, position: 0, color: '#5e9eff' },
  { id: 4, slug: 'team-4', name: 'Team 4', score: 0, position: 0, color: '#e47a30' },
]
const GAME = {
  id: 1,
  pin: '7hwe68',
  status: 'playing',
  board_id: 1,
  user_id: 1,
  current_team_id: 1
}
const ANSWERS = [
  { question_id: 1, game_id: 1, team_id: 1, is_correct: true },
  { question_id: 3, game_id: 1, team_id: 1, is_correct: false },
  { question_id: 6, game_id: 1, team_id: 1, is_correct: true }
]

const throwIfSupabaseError = (error, entityName) => {
  if (error) {
    throw new Error(`[supabase] Failed to fetch ${entityName}: ${error.message}`)
  }
}

export const fetchBoard = async () => {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle()

  throwIfSupabaseError(error, 'boards')
  return data
}

export const fetchGame = async () => {
  // TODO
  // const { data, error } = await supabase
  //   .from('games')
  //   .select('*')
  //   .order('id', { ascending: true })

  // throwIfSupabaseError(error, 'games')
  return GAME
}

export const updateGame = async (gameId, updates) => {
  // TODO
  // const { data, error } = await supabase
  //   .from('games')
  //   .update(updates)
  //   .eq('id', gameId)

  // throwIfSupabaseError(error, 'games')
  // return data
  return { ...GAME, ...updates }
}

export const fetchTeams = async () => {
  // TODO
  // const { data, error } = await supabase
  //   .from('teams')
  //   .select('*')
  //   .order('id', { ascending: true })

  // throwIfSupabaseError(error, 'teams')
  return TEAMS
}

export const updateTeam = async (teamId, updates) => {
  // TODO
  // const { data, error } = await supabase
  //   .from('teams')
  //   .update(updates)
  //   .eq('id', teamId)

  // throwIfSupabaseError(error, 'teams')
  // return data
  return { ...TEAMS.find((team) => team.id === teamId), ...updates }
}

export const fetchAnswers = async () => {
  // TODO
  // const { data, error } = await supabase
  //   .from('answers')
  //   .select('*')
  //   .order('id', { ascending: true })

  // throwIfSupabaseError(error, 'answers')
  return ANSWERS
}

export const insertAnswer = async (answer) => {
  // TODO
  // const { data, error } = await supabase
  //   .from('answers')
  //   .insert(answer)

  // throwIfSupabaseError(error, 'answers')
  // return data

  return answer
}

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true })

  throwIfSupabaseError(error, 'categories')
  return data ?? []
}

export const fetchBoardCategory = async () => {
  const { data, error } = await supabase
    .from('board_category')
    .select('*')
    .order('position', { ascending: true })

  throwIfSupabaseError(error, 'board_category')
  return data ?? []
}

export const fetchQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('id', { ascending: true })

  throwIfSupabaseError(error, 'questions')
  return data ?? []
}

export const fetchInitialGameData = async () => {
  const [board, game, teams, answers, categories, boardCategory, questions] = await Promise.all([
    fetchBoard(), fetchGame(), fetchTeams(), fetchAnswers(),
    fetchCategories(), fetchBoardCategory(), fetchQuestions()
  ]);

  if (!board || !game || teams.length === 0 || answers.length === 0 || categories.length === 0 || boardCategory.length === 0 || questions.length === 0) {
    throw new Error('Incomplete game data from Supabase. Check RLS policies.');
  }

  return { board, game, teams, answers, categories, boardCategory, questions };
}

export const getCategoryIconPublicUrl = (iconPath) => {
  if (typeof iconPath !== 'string' || !iconPath.includes('/')) {
    return null
  }

  const normalizedPath = iconPath.replace(/^\/+/, '')
  return supabase.storage.from(CATEGORY_ICONS_BUCKET).getPublicUrl(normalizedPath).data.publicUrl
}