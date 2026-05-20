function BoardLayoutPage() {
  return (
    <article className="rounded-xl border bg-card p-4 sm:p-6">
      <p className="text-sm font-medium text-muted-foreground">Step 3</p>
      <h2 className="mt-1 text-2xl font-semibold text-primary">Board layout</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Generate and preview the randomized tile layout before creating the board.
      </p>

      <div className="mt-6 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        Layout generation and preview will be added in a later implementation step.
      </div>
    </article>
  )
}

export default BoardLayoutPage
