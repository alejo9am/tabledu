import {
  BubbleChatQuestionIcon,
  DashboardSquare02Icon,
  PaintBoardIcon,
} from '@hugeicons/core-free-icons'
import TilesHelpCard from '@/features/tiles/components/TilesHelpCard'

function QuestionTilesHelpCard() {
  const sections = [
    {
      icon: BubbleChatQuestionIcon,
      iconClassName: 'text-warning',
      title: 'Questions Live Inside',
      description: 'Open a tile to add, edit, and organize the individual questions students will answer in gameplay.',
    },
    {
      icon: DashboardSquare02Icon,
      iconClassName: 'text-success',
      title: 'Board Reuse',
      description: 'The same question tile can be reused across multiple boards, so updates to its question bank stay centralized.',
    },
    {
      icon: DashboardSquare02Icon,
      iconClassName: 'text-primary',
      title: 'Delete with Caution',
      description: 'Deleting a question tile permanently removes its full question bank. If the tile is already used in board layouts, remove it from those boards before deleting it here.',
    },
  ]

  return <TilesHelpCard sections={sections} />
}

export default QuestionTilesHelpCard
