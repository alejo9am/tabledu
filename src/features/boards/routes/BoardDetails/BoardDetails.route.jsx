import { useParams } from "react-router-dom"
import useAppNavigation from '@/hooks/useAppNavigation.hook'
import BoardInfoCard from '@/features/boards/routes/BoardDetails/components/BoardInfoCard'
import LayoutEditBar from '@/features/boards/routes/BoardDetails/components/LayoutEditBar'
import ScoringRulesCard from '@/features/boards/routes/BoardDetails/components/ScoringRulesCard'
import SpiralPanel from '@/features/boards/routes/BoardDetails/components/SpiralPanel'
import TilesPanel from '@/features/boards/routes/BoardDetails/components/TilesPanel'
import { useBoardDetails } from '@/features/boards/routes/BoardDetails/hooks/useBoardDetails.hook'
import ErrorState from "@/components/ui/error-state"

function BoardDetailsPage() {
  const { boardId } = useParams()
  const { goTo } = useAppNavigation()
  const vm = useBoardDetails({ boardId })
  const { details, isLoading, error, reload } = vm.page

  const displayedLayout = vm.layoutEditor.isEditingLayout ? vm.layoutEditor.draftLayout : details?.layout ?? []
  const displayedSpecialTiles = vm.layoutEditor.isEditingLayout
    ? Object.values(vm.layoutEditor.draftTiles.specialTiles)
    : details?.specialTiles ?? []
  const displayedQuestionTiles = vm.layoutEditor.isEditingLayout
    ? vm.layoutEditor.draftTiles.questionTiles
    : details?.selectedQuestionTiles ?? []
  const displayedScoring = vm.scoringEditor.isEditingScoring
    ? vm.scoringEditor.draftScoring
    : vm.scoringEditor.scoring
  const hasActiveEditor = vm.boardInfo.isEditingInfo || vm.scoringEditor.isEditingScoring || vm.layoutEditor.isEditingLayout

  if (error) {
    // Error while fetching board details (e.g. network error, supabase error, etc.)
    return (
      <section className="flex flex-1 flex-col justify-center items-center gap-4 p-4 pt-0" aria-label="Board details page">
        <ErrorState
          title="We could not load this board"
          description="Something went wrong while fetching the board details. Please try again."
          technicalDetails={error.technicalMessage}
          onRetry={reload}
        />
      </section>
    )
  }

  if (!isLoading && !details) {
    // Board not found or user does not have access to it
    return (
      <section className="flex flex-1 flex-col justify-center items-center gap-4 p-4 pt-0" aria-label="Board details page">
        <ErrorState
          title="Board not found"
          description="This board does not exist or you do not have access to it."
          retryLabel="Go to boards"
          onRetry={() => goTo('/boards')}
        />
      </section>
    )
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0" aria-label="Board details page">
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        <BoardInfoCard
          isLoading={isLoading}
          boardId={details?.board?.id}
          name={details?.board?.name}
          description={details?.board?.description}
          questionTiles={displayedQuestionTiles}
          hasActiveEditor={hasActiveEditor}
          sessions={details?.sessions ?? []}
          isEditingInfo={vm.boardInfo.isEditingInfo}
          isSavingInfo={vm.boardInfo.isSavingInfo}
          draftInfo={vm.boardInfo.draftInfo}
          onEditInfo={vm.boardInfo.startInfoEdit}
          onCancelInfo={vm.boardInfo.cancelInfoEdit}
          onDraftInfoChange={vm.boardInfo.updateDraftInfo}
          onSaveInfo={vm.actions.saveInfo}
        />
        <ScoringRulesCard
          isLoading={isLoading}
          scoring={displayedScoring}
          isEditingScoring={vm.scoringEditor.isEditingScoring}
          isSavingScoring={vm.scoringEditor.isSavingScoring}
          hasActiveEditor={hasActiveEditor}
          onChange={vm.scoringEditor.updateDraftScoring}
          onEdit={vm.scoringEditor.startScoringEdit}
          onCancel={vm.scoringEditor.cancelScoringEdit}
          onSave={vm.actions.saveScoring}
        />

        <LayoutEditBar
          isLoading={isLoading}
          isEditingLayout={vm.layoutEditor.isEditingLayout}
          isSavingLayout={vm.layoutEditor.isSavingLayout}
          hasUnsavedLayoutChanges={vm.layoutEditor.hasUnsavedLayoutChanges}
          hasActiveEditor={hasActiveEditor}
          onStartLayoutEdit={vm.layoutEditor.startLayoutEdit}
          onDiscardLayout={vm.layoutEditor.cancelLayoutEdit}
          onSaveLayout={vm.actions.saveLayout}
        />

        <SpiralPanel
          isLoading={isLoading}
          isEditing={vm.layoutEditor.isEditingLayout}
          layout={displayedLayout}
          questionTiles={displayedQuestionTiles}
          specialTiles={displayedSpecialTiles.filter((tile) => tile.enabled)}
          onUpdateCell={vm.layoutEditor.updateCell}
        />
        <TilesPanel
          isLoading={isLoading}
          isEditing={vm.layoutEditor.isEditingLayout}
          hasActiveEditor={hasActiveEditor}
          specialTiles={displayedSpecialTiles}
          questionTiles={displayedQuestionTiles}
          availableQuestionTiles={details?.availableQuestionTiles ?? []}
          onRegenerateLayout={vm.layoutEditor.regenerateLayout}
          onToggleSpecial={vm.layoutEditor.toggleSpecialTile}
          onAddQuestionTile={vm.layoutEditor.addQuestionTile}
          onRemoveQuestionTile={vm.layoutEditor.removeQuestionTile}
          onSwapQuestionTile={vm.layoutEditor.swapQuestionTile}
        />
      </div>
    </section>
  )
}

export default BoardDetailsPage
