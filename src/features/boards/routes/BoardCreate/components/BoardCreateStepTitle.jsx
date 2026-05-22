const stepTitles = {
  1: {
    title: 'Board details',
    description: 'Start with a clear name and a short explanation of the classroom activity',
  },
  2: {
    title: 'Special tiles',
    description: 'Choose which surprise tiles can appear on the board',
  },
  3: {
    title: 'Question tiles',
    description: 'Each question tile is linked to a question bank. When a team lands on that tile, it must answer one question from that bank.',
  },
  4: {
    title: 'Board layout',
    description: 'This is your final check before creating the board. Generate a layout to see where each tile appears, and go back to any previous step if you want to adjust names, scores, or selected tiles.',
  },
}

function BoardCreateStepTitle({ currentStep }) {
  const step = stepTitles[currentStep]

  if (!step) return null

  return (
    <section className="rounded-2xl border bg-card/90 px-4 py-3 sm:px-5" aria-label="Current board creation step">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Step {currentStep}</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-primary sm:text-3xl">{step.title}</h1>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{step.description}</p>
    </section>
  )
}

export default BoardCreateStepTitle
