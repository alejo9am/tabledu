import BoardCreateStepTitle from '@/features/boards/routes/BoardCreate/components/BoardCreateStepTitle'

function BoardLayoutPage() {
  return (
    <div className="space-y-4">
      <BoardCreateStepTitle currentStep={4} />

      <article className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Layout generation and preview will be added in a later implementation step.
        </div>
      </article>
    </div>
  )
}

export default BoardLayoutPage
