import TeamEditorCard from '@/features/games/routes/NewGame/components/TeamEditorCard'

function TeamsList({ teamsSetup, isSubmitting }) {
  const { teams } = teamsSetup

  return (
    <div className="mt-6 flex min-h-0 flex-col gap-4 lg:flex-1">
      <div className="space-y-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
        {teams.map((team, index) => (
          <TeamEditorCard
            key={`team-${index}`}
            index={index}
            team={team}
            teamsSetup={teamsSetup}
            isSubmitting={isSubmitting}
          />
        ))}
      </div>

    </div>
  )
}

export default TeamsList
