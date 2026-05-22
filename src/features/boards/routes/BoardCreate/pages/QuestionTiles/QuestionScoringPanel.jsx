import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'

function QuestionScoringPanel({ scoreCorrect, scoreIncorrect, onScoreCorrectChange, onScoreIncorrectChange }) {
  return (
    <aside className="rounded-2xl border bg-card p-4">
      <h3 className="font-semibold">Scoring rules</h3>
      <p className="mt-1 text-sm text-muted-foreground">Set the score gained or lost when teams answer.</p>
      <div className="mt-4 flex justify-center gap-6">
        <div className="grid gap-1 w-full">
          <Label id="score-correct-label" className="justify-center text-xs font-semibold text-muted-foreground">Correct answer</Label>
          <NumberInput aria-labelledby="score-correct-label" value={scoreCorrect} onChange={onScoreCorrectChange} />
        </div>
        <div className="grid gap-1 w-full">
          <Label id="score-incorrect-label" className="justify-center text-xs font-semibold text-muted-foreground">Incorrect answer</Label>
          <NumberInput aria-labelledby="score-incorrect-label" value={scoreIncorrect} onChange={onScoreIncorrectChange} />
        </div>
      </div>
    </aside>
  )
}

export default QuestionScoringPanel
