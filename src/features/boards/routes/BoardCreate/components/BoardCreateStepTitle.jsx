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
    description: 'Select the question banks that will become question tiles on this board',
  },
  4: {
    title: 'Board layout',
    description: 'Generate and preview the randomized tile layout before creating the board',
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
