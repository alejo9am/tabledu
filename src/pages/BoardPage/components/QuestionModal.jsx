import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const QuestionModal = ({ onFinishTurn, onConfirmAnswer, questionText, currentTeamName }) => {
  const dialogRef = useRef(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    return () => { if (dialog.open) dialog.close() }
  }, [])

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !onConfirmAnswer) return
    const nextResult = onConfirmAnswer(selectedAnswer)
    if (nextResult) setResult(nextResult)
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto w-full max-w-md rounded-2xl border border-border bg-card p-0 shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm"
      aria-modal="true"
      aria-label="Question modal"
    >
      {/* Header */}
      <header className="border-b border-border px-6 pt-6 pb-4">
        {currentTeamName && (
          <p className="mb-1 text-md font-medium text-muted-foreground">{currentTeamName}'s turn</p>
        )}
        <h2 className="font-display text-2xl font-bold text-primary">Question</h2>
      </header>

      {/* Body */}
      <div className="flex flex-col gap-6 px-6 py-6">
        <p className="text-xl font-medium text-foreground leading-snug">
          {questionText ?? 'No question available for this category.'}
        </p>

        {!result && questionText && (
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Choose an answer">
            {[true, false].map((value) => (
              <Button
                key={String(value)}
                type="button"
                onClick={() => setSelectedAnswer(value)}
                variant={value
                  ? (selectedAnswer === true ? 'answerTrueSelected' : 'answerTrue')
                  : (selectedAnswer === false ? 'answerFalseSelected' : 'answerFalse')}
                size="answer"
              >
                {value ? 'TRUE' : 'FALSE'}
              </Button>
            ))}
          </div>
        )}

        {result && (
          <section className="flex flex-col gap-4" aria-live="polite">
            <div className={cn(
              "rounded-xl border-2 p-4 text-center",
              result.isCorrect
                ? "border-success-700 bg-success-200 text-success-700"
                : "border-destructive bg-destructive-200 text-destructive-700"
            )}>
              <p className="text-xl font-bold">
                {result.isCorrect ? 'Correct!' : 'Wrong answer.'}
              </p>
              <p className="mt-1 text-sm font-medium">
                {result.pointsDelta > 0 ? `+${result.pointsDelta}` : result.pointsDelta} points
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3 text-sm">
              <span className="text-muted-foreground">Correct answer</span>
              <strong className="font-bold text-foreground">{result.correctAnswer ? 'TRUE' : 'FALSE'}</strong>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="flex justify-end gap-2 border-t border-border px-6 py-4">
        {!result && questionText && (
          <Button onClick={handleConfirmAnswer} disabled={selectedAnswer === null} size="lg">
            Confirm
          </Button>
        )}
        {(!questionText || result) && (
          <Button variant="secondary" size="lg" onClick={onFinishTurn}>
            Close
          </Button>
        )}
      </footer>
    </dialog>
  )
}

export default QuestionModal