import { useEffect, useRef, useState } from 'react'

const ChallengeModal = ({
  currentTeamName,
  opponentTeamName,
  availableTeams,
  questionCategories,
  challengeQuestions,
  challengeResult,
  onConfirmSetup,
  onQuestionsAnswered,
  onClose
}) => {
  const dialogRef = useRef(null)
  const [selectedOpponentId, setSelectedOpponentId] = useState(null)
  const [categoryMode, setCategoryMode] = useState(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [phase, setPhase] = useState('setup')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionAnswers, setQuestionAnswers] = useState([
    { activeTeamAnswer: null, opponentTeamAnswer: null },
    { activeTeamAnswer: null, opponentTeamAnswer: null }
  ])

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

  // Boolean indicating whether the "Continue" button can be enabled in the setup phase
  const canConfirm = selectedOpponentId !== null && categoryMode !== null && (categoryMode === 'any' || selectedCategoryId !== null)

  const handleConfirm = () => {
    if (!canConfirm || !onConfirmSetup) {
      return
    }

    onConfirmSetup({
      opponentTeamId: selectedOpponentId,
      categoryId: categoryMode === 'any' ? null : selectedCategoryId
    })

    setPhase('question')
    setCurrentQuestionIndex(0)
    setQuestionAnswers([
      { activeTeamAnswer: null, opponentTeamAnswer: null },
      { activeTeamAnswer: null, opponentTeamAnswer: null }
    ])
  }

  const handleSelectCategoryMode = (mode) => {
    setCategoryMode(mode)
    if (mode === 'any') {
      setSelectedCategoryId(null)
    }
  }

  const handleActiveTeamAnswer = (value) => {
    setQuestionAnswers((prev) => prev.map((set, i) =>
      i === currentQuestionIndex ? { ...set, activeTeamAnswer: value } : set
    ))
  }

  const handleOpponentTeamAnswer = (value) => {
    setQuestionAnswers((prev) => prev.map((set, i) =>
      i === currentQuestionIndex ? { ...set, opponentTeamAnswer: value } : set
    ))
  }

  const currentQuestion = challengeQuestions[currentQuestionIndex] ?? null
  const currentAnswerSet = questionAnswers[currentQuestionIndex] ?? {
    activeTeamAnswer: null,
    opponentTeamAnswer: null
  }
  const canConfirmQuestion = (
    currentQuestion !== null
    && currentAnswerSet.activeTeamAnswer !== null
    && currentAnswerSet.opponentTeamAnswer !== null
  )

  const getOutcomeText = () => {
    if (!challengeResult) {
      return 'Challenge result'
    }

    if (challengeResult.outcome === 'active-wins') {
      return `${currentTeamName} wins the challenge`
    }

    if (challengeResult.outcome === 'opponent-wins') {
      return `${opponentTeamName} wins the challenge`
    }

    return 'Challenge ended in a draw'
  }

  const formatPointsDelta = (delta) => {
    if (delta > 0) {
      return `+${delta}`
    }

    return `${delta}`
  }

  const handleConfirmQuestions = () => {
    if (!canConfirmQuestion) {
      return
    }

    // If there are more questions to answer, just move to the next one
    if (currentQuestionIndex !== challengeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      return
    }

    if (onQuestionsAnswered) {
      onQuestionsAnswered(questionAnswers)
      setPhase('result')
    }
  }

  const modalClassName = `question-modal ${phase === 'result' ? 'question-modal--challenge-result' : ''}`.trim()

  return (
    <dialog ref={dialogRef} className={modalClassName} aria-modal="true" aria-label="Challenge setup modal">
      {phase === 'setup' && (
        <>
          <div className="question-modal__body">

            <section className="challenge-modal__section">
              <p className="challenge-modal__section-title">Choose an opponent</p>
              <div className="challenge-modal__option-group" role="group" aria-label="Opponent team">
                {availableTeams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    className={`challenge-modal__option-button ${selectedOpponentId === team.id ? 'challenge-modal__option-button--selected' : ''}`}
                    onClick={() => setSelectedOpponentId(team.id)}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            </section>

            <section className="challenge-modal__section">
              <p className="challenge-modal__section-title">Choose a category</p>
              <div className="challenge-modal__option-group" role="group" aria-label="Category mode">
                <button
                  type="button"
                  className={`challenge-modal__option-button ${categoryMode === 'any' ? 'challenge-modal__option-button--selected' : ''}`}
                  onClick={() => handleSelectCategoryMode('any')}
                >
                  Any category
                </button>
                <button
                  type="button"
                  className={`challenge-modal__option-button ${categoryMode === 'specific' ? 'challenge-modal__option-button--selected' : ''}`}
                  onClick={() => handleSelectCategoryMode('specific')}
                >
                  Pick a category
                </button>
              </div>

              {categoryMode === 'specific' && (
                <div className="challenge-modal__subcategories" role="group" aria-label="Specific category">
                  {questionCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={`challenge-modal__option-button challenge-modal__option-button--sub ${selectedCategoryId === category.id ? 'challenge-modal__option-button--selected' : ''}`}
                      onClick={() => setSelectedCategoryId(category.id)}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>

          <footer className="question-modal__actions">
            <button
              className="question-modal__button"
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm}
            >
              Continue
            </button>
          </footer>
        </>
      )}

      {phase === 'question' && (
        <>
          <div className="question-modal__body">
            <section className="challenge-modal__section">
              <p className="challenge-modal__section-title">
                Challenge question {currentQuestionIndex + 1} of {challengeQuestions.length}
              </p>
              <p className="question-modal__text">
                {currentQuestion?.text ?? 'No question available for this challenge step.'}
              </p>
            </section>

            <div className="challenge-modal__duel-grid">
              <section className="challenge-modal__duel-panel">
                <p className="challenge-modal__team-label">{currentTeamName}</p>
                <div className="question-modal__answers" role="group" aria-label={`${currentTeamName} answer`}>
                  <button
                    type="button"
                    className={`question-modal__answer-button question-modal__answer-button--true ${currentAnswerSet.activeTeamAnswer === true ? 'question-modal__answer-button--selected' : ''}`}
                    onClick={() => handleActiveTeamAnswer(true)}
                  >
                    TRUE
                  </button>
                  <button
                    type="button"
                    className={`question-modal__answer-button question-modal__answer-button--false ${currentAnswerSet.activeTeamAnswer === false ? 'question-modal__answer-button--selected' : ''}`}
                    onClick={() => handleActiveTeamAnswer(false)}
                  >
                    FALSE
                  </button>
                </div>
              </section>

              <section className="challenge-modal__duel-panel">
                <p className="challenge-modal__team-label">{opponentTeamName ?? 'Opponent team'}</p>
                <div className="question-modal__answers" role="group" aria-label={`${opponentTeamName ?? 'Opponent team'} answer`}>
                  <button
                    type="button"
                    className={`question-modal__answer-button question-modal__answer-button--true ${currentAnswerSet.opponentTeamAnswer === true ? 'question-modal__answer-button--selected' : ''}`}
                    onClick={() => handleOpponentTeamAnswer(true)}
                  >
                    TRUE
                  </button>
                  <button
                    type="button"
                    className={`question-modal__answer-button question-modal__answer-button--false ${currentAnswerSet.opponentTeamAnswer === false ? 'question-modal__answer-button--selected' : ''}`}
                    onClick={() => handleOpponentTeamAnswer(false)}
                  >
                    FALSE
                  </button>
                </div>
              </section>
            </div>
          </div>

          <footer className="question-modal__actions">
            <button
              className="question-modal__button"
              type="button"
              onClick={handleConfirmQuestions}
              disabled={!canConfirmQuestion}
            >
              {currentQuestionIndex === 0 ? 'Next question' : 'Finish answers'}
            </button>
          </footer>
        </>
      )}

      {phase === 'result' && (
        <>
          <div className="question-modal__body">
            <section className="challenge-modal__section">
              <p className="challenge-modal__section-title">Challenge result</p>
              <section className="question-modal__result" aria-live="polite">
                <p className="question-modal__result-status">{getOutcomeText()}</p>
                <div className="challenge-result__score-grid">
                  <article className="challenge-result__score-card">
                    <p className="challenge-result__team-name">{currentTeamName}</p>
                    <p className="challenge-result__team-meta">Correct answers: {challengeResult?.activeCorrectCount ?? 0}</p>
                    <p className="challenge-result__team-points">Points: {formatPointsDelta(challengeResult?.activePointsDelta ?? 0)}</p>
                  </article>
                  <article className="challenge-result__score-card">
                    <p className="challenge-result__team-name">{opponentTeamName}</p>
                    <p className="challenge-result__team-meta">Correct answers: {challengeResult?.opponentCorrectCount ?? 0}</p>
                    <p className="challenge-result__team-points">Points: {formatPointsDelta(challengeResult?.opponentPointsDelta ?? 0)}</p>
                  </article>
                </div>

                <div className="challenge-result__questions">
                  {challengeQuestions.map((question, index) => {
                    const answerSet = questionAnswers[index] ?? { activeTeamAnswer: null, opponentTeamAnswer: null }
                    const correctnessTuple = challengeResult?.correctnessTuples?.[index] ?? [false, false]
                    const [activeIsCorrect, opponentIsCorrect] = correctnessTuple

                    return (
                      <article key={question.id} className="challenge-result__question-card">
                        <p className="challenge-result__question-title">Question {index + 1}</p>
                        <p className="challenge-result__question-text">{question.text}</p>
                        <p className="challenge-result__correct-answer">
                          Correct answer: <strong>{question.answer ? 'TRUE' : 'FALSE'}</strong>
                        </p>

                        <div className="challenge-result__answers-grid">
                          <div className={`challenge-result__answer-chip ${activeIsCorrect ? 'challenge-result__answer-chip--ok' : 'challenge-result__answer-chip--bad'}`}>
                            <span>{currentTeamName}</span>
                            <span>{answerSet.activeTeamAnswer ? 'TRUE' : 'FALSE'}</span>
                          </div>
                          <div className={`challenge-result__answer-chip ${opponentIsCorrect ? 'challenge-result__answer-chip--ok' : 'challenge-result__answer-chip--bad'}`}>
                            <span>{opponentTeamName}</span>
                            <span>{answerSet.opponentTeamAnswer ? 'TRUE' : 'FALSE'}</span>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            </section>
          </div>

          <footer className="question-modal__actions">
            <button
              className="question-modal__button"
              type="button"
              onClick={onClose}
            >
              Close
            </button>
          </footer>
        </>
      )}
    </dialog>
  )
}

export default ChallengeModal
