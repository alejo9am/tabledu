import BoardCreateStepTitle from '@/features/boards/routes/BoardCreate/components/BoardCreateStepTitle'

function QuestionTilesPage() {
  return (
    <div className="space-y-4">
      <BoardCreateStepTitle currentStep={3} />

      <article className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Question tile selection will be added in the next implementation step.
        </div>
      </article>
    </div>
  )
}

export default QuestionTilesPage
