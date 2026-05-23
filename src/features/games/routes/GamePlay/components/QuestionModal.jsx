import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useGame } from '../context/GameContext'
import { TURN_PHASES } from '../constants/turnPhases'

const QuestionModal = () => {
  const dialogRef = useRef(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [result, setResult] = useState(null)
  const {
    board,
    currentTeam,
    currentQuestion,
    turnPhase,
    actions: { updateScore, saveAnswer },
    handlers: { finishTurn }
  } = useGame()
  const questionText = currentQuestion?.text ?? null
  const currentTeamName = currentTeam?.name ?? null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (turnPhase === TURN_PHASES.QUESTION && !dialog.open) dialog.showModal()
    return () => { if (dialog && dialog.open) dialog.close() }
  }, [turnPhase])

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !currentQuestion || !currentTeam) return

    const isCorrect = currentQuestion.answer === selectedAnswer
    const pointsDelta = isCorrect ? board.score_correct : board.score_incorrect

    updateScore(currentTeam.id, pointsDelta)
    saveAnswer({
      questionId: currentQuestion.id,
      teamId: currentTeam.id,
      isCorrect
    })

    setResult({
      isCorrect,
      pointsDelta,
      correctAnswer: currentQuestion.answer
    })
  }

  if (turnPhase !== TURN_PHASES.QUESTION) return null

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => e.preventDefault()} // evita que el modal se cierre al hacer click fuera o presionar Esc
      className="fixed inset-0 m-auto w-full max-w-md rounded-2xl border border-border bg-card p-0 shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm animate-in fade-in zoom-in"
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
          {questionText ?? 'No question available for this tile.'}
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
                ? "border-success bg-success-200 text-success-700"
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
          <Button variant="secondary" size="lg" onClick={() => {
            setSelectedAnswer(null)
            setResult(null)
            finishTurn()
          }}>
            Close
          </Button>
        )}
      </footer>
    </dialog>
  )
}

export default QuestionModal
