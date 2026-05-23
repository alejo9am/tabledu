const stepTitles = {
  1: {
    title: 'Board details',
    description: 'Start with a clear name and a short explanation of the classroom activity',
  },
  2: {
    title: 'Special tiles',
    description: 'Tiles are the spaces where teams land during play. Here you decide which special tiles can appear on your board.',
  },
  3: {
    title: 'Question tiles',
    helper: 'Each question tile is a topic with its own question bank.',
    description: 'Choose up to 6 tiles to determine what students will be asked during play.',
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
      {step.helper ? <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{step.helper}</p> : null}
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{step.description}</p>
    </section>
  )
}

export default BoardCreateStepTitle
