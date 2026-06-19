import { useState } from 'react'
import { MAX_TEAMS, MIN_TEAMS, TEAM_COLORS } from '@/features/games/config/teamSetup.config'

const createTeam = (teams) => {
  const usedTeamNumbers = new Set(
    teams
      .map((team) => {
        const match = /^Team\s+(\d+)$/i.exec(team.name.trim())
        return match ? Number(match[1]) : null
      })
      .filter((number) => Number.isInteger(number) && number > 0)
  )

  let nextName = `Team ${teams.length + 1}`
  for (let candidate = 1; candidate <= MAX_TEAMS; candidate += 1) {
    if (!usedTeamNumbers.has(candidate)) {
      nextName = `Team ${candidate}`
      break
    }
  }

  const usedColors = new Set(teams.map((team) => team.color?.toLowerCase()).filter(Boolean))
  const nextColor = TEAM_COLORS.find((color) => !usedColors.has(color.toLowerCase())) ?? TEAM_COLORS[teams.length % TEAM_COLORS.length]

  return {
    name: nextName,
    color: nextColor,
    members: [],
  }
}

const getTeamValidationError = (teams) => {
  if (teams.length > MAX_TEAMS) {
    return `You can add up to ${MAX_TEAMS} teams.`
  }

  const normalizedNames = teams.map((team) => team.name.trim()).filter(Boolean)

  if (normalizedNames.length < MIN_TEAMS) {
    return 'Define at least two teams to continue.'
  }

  const uniqueNames = new Set(normalizedNames.map((name) => name.toLowerCase()))
  if (uniqueNames.size !== normalizedNames.length) {
    return 'Team names must be unique.'
  }

  const normalizedColors = teams.map((team) => team.color?.toLowerCase()).filter(Boolean)
  const uniqueColors = new Set(normalizedColors)
  if (uniqueColors.size !== normalizedColors.length) {
    return 'Each team must have a unique color.'
  }

  return null
}

export const useTeamsSetup = () => {
  const [teams, setTeams] = useState(() => {
    const initialTeams = []
    initialTeams.push(createTeam(initialTeams))
    initialTeams.push(createTeam(initialTeams))
    return initialTeams
  })
  const handleTeamNameChange = (index, name) => {
    setTeams((current) => current.map((team, currentIndex) => (currentIndex === index ? { ...team, name } : team)))
  }

  const handleTeamColorChange = (index, color) => {
    setTeams((current) => current.map((team, currentIndex) => (currentIndex === index ? { ...team, color } : team)))
  }

  const addMember = (teamIndex) => {
    setTeams((current) =>
      current.map((team, currentIndex) =>
        currentIndex === teamIndex
          ? {
              ...team,
              members: [...team.members, ''],
            }
          : team
      )
    )
  }

  const removeMember = (teamIndex, memberIndex) => {
    setTeams((current) =>
      current.map((team, currentIndex) => {
        if (currentIndex !== teamIndex) return team

        return {
          ...team,
          members: team.members.filter((_, currentMemberIndex) => currentMemberIndex !== memberIndex),
        }
      })
    )
  }

  const handleMemberNameChange = (teamIndex, memberIndex, memberName) => {
    setTeams((current) =>
      current.map((team, currentIndex) => {
        if (currentIndex !== teamIndex) return team

        return {
          ...team,
          members: team.members.map((member, currentMemberIndex) => (currentMemberIndex === memberIndex ? memberName : member)),
        }
      })
    )
  }

  const addTeam = () => {
    if (teams.length >= MAX_TEAMS) {
      return
    }

    setTeams((current) => [...current, createTeam(current)])
  }

  const removeTeam = (index) => {
    if (teams.length <= MIN_TEAMS) {
      return
    }

    setTeams((current) => current.filter((_, currentIndex) => currentIndex !== index))
  }

  const validateTeams = () => {
    return getTeamValidationError(teams)
  }

  const buildTeamsPayload = () => {
    return teams
      .map((team) => ({
        name: team.name.trim(),
        color: team.color,
        members: team.members.map((member) => member.trim()).filter(Boolean),
      }))
      .filter((team) => team.name)
  }

  return {
    teams,
    colors: TEAM_COLORS,
    addTeam,
    removeTeam,
    handleTeamNameChange,
    handleTeamColorChange,
    addMember,
    removeMember,
    handleMemberNameChange,
    validateTeams,
    buildTeamsPayload,
    canAddTeams: teams.length < MAX_TEAMS,
    canRemoveTeams: teams.length > MIN_TEAMS,
  }
}
