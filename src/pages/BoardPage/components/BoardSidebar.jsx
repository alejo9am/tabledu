import Token from '@/components/ui/token'

import { cn } from '@/lib/utils'
import { getContrastTextColor } from '@/utils/gameUtils'

import SidebarInfoCard from './SidebarInfoCard'
import Die from './Die'

import { useGame } from '../context/GameContext'

function BoardSidebar({ className }) {
  const {
    currentTeam,
    teams
  } = useGame()

  return (
    <aside
      className={cn(
        'gap-10 overflow-hidden v-lg:gap-7 v-md:gap-5',
        className
      )}
      aria-label="Sidebar"
    >

      <section className="flex w-full max-w-104 flex-col items-center gap-4 v-lg:gap-3" aria-label="Teams security levels">
        <h2 className="font-semibold font-display text-primary text-3xl v-lg:text-2xl">Team security levels</h2>
        <ul className="w-full bg-card shadow-lg rounded-xl">
          {teams.map((team, index) => {
            const isCurrentTeam = team.id === currentTeam?.id
            const activeTextColor = getContrastTextColor(team.color)

            return (
              <li
                key={team.id}
                className={cn(
                  'relative flex items-center justify-between rounded-lg font-medium',
                  'gap-12 p-4 text-xl xl:gap-36 v-lg:gap-8 v-lg:p-3 v-lg:text-lg v-md:gap-6 v-md:p-2.5 v-md:text-base',
                  isCurrentTeam
                    ? "bg-(--team-color) text-(--team-text)"
                    : "bg-card text-card-foreground"
                )}
                style={
                  isCurrentTeam
                    ? { '--team-color': team.color, '--team-text': activeTextColor }
                    : undefined
                }
                aria-current={isCurrentTeam ? 'true' : undefined}
              >
                <span className="flex items-center gap-2">
                  <Token color={team.color} />
                  <span>{team.name}</span>
                </span>
                <span className="font-semibold">{team.score} pts</span>
                {index < teams.length - 1 && !isCurrentTeam && (
                  <span
                    aria-hidden="true"
                    className="absolute right-4 bottom-0 left-4 border-b-2 border-border"
                  />
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <Die />

      <SidebarInfoCard />
    </aside>
  )
}

export default BoardSidebar
