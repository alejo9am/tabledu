import { BubbleChatQuestionIcon } from '@hugeicons/core-free-icons'
import { useParams } from 'react-router-dom'
import ErrorState from '@/components/ui/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import TileIconPickerDialog from '@/features/boards/routes/BoardCreate/components/TileIconPickerDialog'
import QuestionTileHeaderCard from '@/features/questionTiles/routes/QuestionTileDetail/components/QuestionTileHeaderCard'
import useQuestionTileDetail from '@/features/questionTiles/routes/QuestionTileDetail/hooks/useQuestionTileDetail.hook'

function QuestionTileDetailRoute() {
  const { tileId } = useParams()
  const vm = useQuestionTileDetail({ tileId })

  if (vm.isLoading) {
    return (
      <section className="flex flex-1 flex-col gap-4 p-4 pt-0" aria-label="Question tile detail page">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </section>
    )
  }

  if (vm.loadError || !vm.tile) {
    return (
      <section className="flex flex-1 items-center justify-center p-4 pt-0" aria-label="Question tile detail page error">
        <ErrorState
          title="Could not load question bank"
          description="We could not load this question tile. Please retry."
          technicalDetails={vm.loadError}
          onRetry={vm.loadData}
        />
      </section>
    )
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0" aria-label="Question tile detail page">
      <QuestionTileHeaderCard
        tile={vm.tile}
        questionCount={vm.questions.length}
        isEditingTileHeader={vm.header.isEditingTileHeader}
        isSavingTileHeader={vm.header.isSavingTileHeader}
        nameDraft={vm.header.nameDraft}
        descriptionDraft={vm.header.descriptionDraft}
        iconDraft={vm.header.iconDraft}
        onNameDraftChange={vm.header.setNameDraft}
        onDescriptionDraftChange={vm.header.setDescriptionDraft}
        onOpenIconPicker={() => vm.header.setIsIconDialogOpen(true)}
        onSave={vm.header.saveTileHeader}
        onCancel={vm.header.cancelTileHeaderEdit}
        onBeginEdit={vm.header.beginTileHeaderEdit}
      />

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


      <TileIconPickerDialog
        open={vm.header.isIconDialogOpen}
        onOpenChange={vm.header.setIsIconDialogOpen}
        value={vm.header.iconDraft}
        tileName={vm.header.nameDraft || vm.tile.name}
        tileType="question"
        onSelect={vm.header.setIconDraft}
      />
    </section>
  )
}

export default QuestionTileDetailRoute
