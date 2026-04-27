import SidebarInfoCard from './SidebarInfoCard'
import Dice from './Dice'
import { cn } from '@/lib/utils'
import Token from '@/components/ui/token'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'

function getContrastTextColor(hexColor) {
  const normalizedColor = hexColor?.replace('#', '')

  if (!normalizedColor || normalizedColor.length !== 6) {
    return undefined
  }

  const red = Number.parseInt(normalizedColor.slice(0, 2), 16)
  const green = Number.parseInt(normalizedColor.slice(2, 4), 16)
  const blue = Number.parseInt(normalizedColor.slice(4, 6), 16)
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000

  return luminance >= 160 ? '#0f172a' : '#ffffff'
}

function BoardSidebar({
  className,
  teams,
  currentTeamId,
  onNextTurn,
  onRollDice,
  onStartTileAction,
  turnPhase,
  currentCategory
}) {
  const diceRef = useRef(null)

  const actionCardData = (() => {
    if (!currentCategory) {
      return null
    }

    if (currentCategory.type === 'question') {
      return {
        title: `${currentCategory.name} Question`,
        description: currentCategory.description,
        buttonLabel: 'Show question'
      }
    }

    if (currentCategory.type === 'special') {
      return {
        title: `${currentCategory.name} Tile`,
        description: currentCategory.description,
        buttonLabel: 'Continue'
      }
    }

    // Fallback info
    return {
      title: 'Tile event',
      description: 'A tile effect was triggered. Continue to resolve this step.',
      buttonLabel: 'Continue'
    }
  })()

  return (
    <aside className={cn("flex flex-col items-center gap-15", className)} aria-label="Sidebar">

      <section className="flex flex-col items-center gap-4 min-w-3/5" aria-label="Teams security levels">
        <h2 className='text-3xl font-semibold font-display text-primary'>Team security levels</h2>
        <ul className="bg-card shadow-lg rounded-xl">
          {teams.map((team, index) => {
            const isCurrentTeam = team.id === currentTeamId
            const activeTextColor = getContrastTextColor(team.color)

            return (
              <li
                key={team.id}
                className={cn(
                  "relative flex items-center justify-between gap-12 xl:gap-36 rounded-lg p-4 text-xl font-medium",
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

      <section aria-label='Dice section' className="flex items-center gap-4">
        <Dice
          ref={diceRef}
          onRollDone={onRollDice}
        />
        <Button
          onClick={() => diceRef.current?.rollDie()}
          disabled={turnPhase !== 'idle'}
        >
          Roll dice
        </Button>
      </section>

      {turnPhase === 'tile_info' && actionCardData && (
        <SidebarInfoCard
          title={actionCardData.title}
          description={actionCardData.description}
          buttonLabel={actionCardData.buttonLabel}
          onConfirm={onStartTileAction}
        />
      )}

      {turnPhase === 'finished' && (
        <SidebarInfoCard
          title="Go to next turn?"
          buttonLabel="YES"
          onConfirm={onNextTurn}
        />
      )}
    </aside>
  )
}

export default BoardSidebar
