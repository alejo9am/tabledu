import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

import { useGame } from '../context/GameContext'
import { TURN_PHASES } from '../constants/turnPhases'

function SidebarInfoCard() {
  const {
    currentCategory, turnPhase,
    handlers: { startTileAction }
  } = useGame()

  const actionCardData = currentCategory ? {
    title: `${currentCategory.name} ${currentCategory.type === 'question' ? 'Question' : 'Tile'}`, // e.g. "History Question", "Attack Tile"
    description: currentCategory.description,
    buttonLabel: currentCategory.type === 'question' ? 'Show question' : 'Continue',
    buttonAction: startTileAction
  } : null

  if (turnPhase !== TURN_PHASES.TILE_INFO) {
    return null
  }

  return (
    <section
      className={cn(
        'flex w-full max-w-96 flex-col items-center justify-between rounded-xl border-2 border-border bg-card text-card-foreground animate-in fade-in slide-in-from-bottom',
        'gap-4 p-6 v-lg:gap-3 v-lg:p-4'
      )}
      aria-label={actionCardData.title}
    >
      <h2 className="text-center font-semibold font-display text-3xl v-lg:text-2xl">{actionCardData.title}</h2>
      {actionCardData.description && <p className="text-center text-lg leading-normal v-lg:text-base v-lg:leading-snug">{actionCardData.description}</p>}
      <Button className="h-11 px-5 text-lg v-lg:h-10 v-lg:px-4 v-lg:text-base" onClick={actionCardData.buttonAction}>{actionCardData.buttonLabel}</Button>
    </section>
  )
}

export default SidebarInfoCard
