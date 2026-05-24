import { BubbleChatQuestionIcon } from '@hugeicons/core-free-icons'
import { useParams } from 'react-router-dom'
import PageHeader from '@/components/layout/PageHeader'
import { Icon } from '@/components/ui/Icon'

function QuestionTileDetailRoute() {
  const { tileId } = useParams()

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0" aria-label="Question tile detail page">
      <PageHeader
        title="Question Tile"
        description="Manage the question bank inside this tile."
      />

      <div className="rounded-2xl border bg-card p-6">
        <p className="flex items-center gap-2 font-semibold text-foreground">
          <Icon icon={BubbleChatQuestionIcon} className="size-5 text-primary" />
          Tile detail route scaffold ready
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Tile ID: <span className="font-mono">{tileId}</span>
        </p>
      </div>
    </section>
  )
}

export default QuestionTileDetailRoute
