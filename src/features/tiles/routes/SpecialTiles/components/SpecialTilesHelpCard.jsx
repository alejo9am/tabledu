import {
  ChampionIcon,
  CircleLock01Icon,
  PaintBoardIcon,
} from '@hugeicons/core-free-icons'
import TilesHelpCard from '@/features/tiles/components/TilesHelpCard'

function SpecialTilesHelpCard() {
  const sections = [
    {
      icon: CircleLock01Icon,
      iconClassName: 'text-destructive',
      title: 'Fixed Set',
      description: 'Tabledu provides exactly three special tiles. You cannot create or delete special tile types.',
    },
    {
      icon: PaintBoardIcon,
      iconClassName: 'text-primary',
      title: 'Customizable',
      description: 'Here you can edit each tile\'s icon, name, and description.',
    },
    {
      icon: ChampionIcon,
      iconClassName: 'text-warning',
      title: 'Scoring',
      description: 'Scoring for these mechanics is configured later per board during setup.',
    },
  ]

  return (
    <TilesHelpCard sections={sections} />
  )
}

export default SpecialTilesHelpCard
