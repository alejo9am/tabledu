import { useRef, useEffect, useState } from 'react'

const QuestionModal = ({ onFinishTurn, onConfirmAnswer, questionText }) => {
  const dialogRef = useRef(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (!dialog.open) {
      dialog.showModal()
    }

    return () => {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [])

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !onConfirmAnswer) {
      return
    }

    const nextResult = onConfirmAnswer(selectedAnswer)
    if (nextResult) {
      setResult(nextResult)
    }
  }

  return (
    <dialog ref={dialogRef} className="question-modal" aria-modal="true" aria-label="Question modal">

      <div className="question-modal__body">
        <p className="question-modal__text">{questionText ?? 'No question available for this category.'}</p>

        {!result && questionText && (
          <div className="question-modal__answers" role="group" aria-label="Choose an answer">
            <button
              type="button"
              className={`question-modal__answer-button question-modal__answer-button--true ${selectedAnswer === true ? 'question-modal__answer-button--selected' : ''}`}
              onClick={() => setSelectedAnswer(true)}
            >
              TRUE
            </button>
            <button
              type="button"
              className={`question-modal__answer-button question-modal__answer-button--false ${selectedAnswer === false ? 'question-modal__answer-button--selected' : ''}`}
              onClick={() => setSelectedAnswer(false)}
            >
              FALSE
            </button>
          </div>
        )}

        {result && (
          <section className="question-modal__result question-modal__result--single" aria-live="polite">
            <p className="challenge-modal__section-title">Question result</p>

            <article className="challenge-result__score-card">
              <p className="challenge-result__team-name">
                {result.isCorrect ? 'Correct answer!' : 'Wrong answer.'}
              </p>
              <p className="challenge-result__team-points">
                Points: {result.pointsDelta > 0 ? `+${result.pointsDelta}` : result.pointsDelta}
              </p>
            </article>

            <article className="challenge-result__question-card">
              <p className="challenge-result__question-title">Question</p>
              <p className="challenge-result__question-text">{questionText ?? 'Question unavailable.'}</p>
              <div className="question-modal__answer-summary">
                <p className="challenge-result__correct-answer">
                  Correct answer: <strong>{result.correctAnswer ? 'TRUE' : 'FALSE'}</strong>
                </p>
                <span className={`question-modal__answer-badge ${result.isCorrect ? 'question-modal__answer-badge--ok' : 'question-modal__answer-badge--bad'}`}>
                  <span className="question-modal__answer-badge-label">Your answer</span>
                  <strong>{selectedAnswer ? 'TRUE' : 'FALSE'}</strong>
                </span>
              </div>
            </article>
          </section>
        )}
      </div>

      <footer className="question-modal__actions">
        {!result && questionText && (
          <button
            className="question-modal__button"
            type="button"
            onClick={handleConfirmAnswer}
            disabled={selectedAnswer === null}
          >
            CONFIRM
          </button>
        )}

        {/* REVIEW: After implementing repeating questions after every of them was used, this is useless */}
        {!result && !questionText && (
          <button className="question-modal__button question-modal__button--secondary" type="button" onClick={onFinishTurn}>Close</button>
        )}

        {result && (
          <button className="question-modal__button question-modal__button--secondary" type="button" onClick={onFinishTurn}>Close</button>
        )}
      </footer>
    </dialog>
  )
}

export default QuestionModal