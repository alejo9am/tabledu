import { useEffect, useRef, useState } from 'react'

import { getTileIconPublicUrl } from '@/services/storage'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getRandomQuestionForTile } from '@/utils/gameUtils'

import { useGame } from '../context/GameContext'
import { TURN_PHASES } from '../constants/turnPhases'

export default function ChallengeModal() {
  const dialogRef = useRef(null)
  const emptyQuestionAnswers = [
    { activeTeamAnswer: null, opponentTeamAnswer: null },
    { activeTeamAnswer: null, opponentTeamAnswer: null }
  ]

  const [selectedOpponentId, setSelectedOpponentId] = useState(null)
  // Topic here means the question bank source represented by a question tile.
  const [topicMode, setTopicMode] = useState(null)
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [failedIcons, setFailedIcons] = useState(new Set())
  const [phase, setPhase] = useState('setup')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [opponentTeam, setOpponentTeam] = useState(null)
  const [challengeQuestions, setChallengeQuestions] = useState([])
  const [challengeResult, setChallengeResult] = useState(null)
  const [questionAnswers, setQuestionAnswers] = useState(emptyQuestionAnswers)

  const {
    board,
    teams,
    answers,
    questions,
    currentTeam,
    turnPhase,
    questionTiles,
    actions: { updateScore, saveAnswer },
    handlers: { finishTurn }
  } = useGame()

  const currentTeamName = currentTeam?.name ?? null
  const opponentTeamName = opponentTeam?.name ?? 'Opponent team'
  const availableTeams = teams.filter((team) => team.id !== currentTeam?.id)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (turnPhase === TURN_PHASES.CHALLENGE && !dialog.open) dialog.showModal()
    return () => { if (dialog && dialog.open) dialog.close() }
  }, [turnPhase])

  // Boolean indicating whether the "Continue" button can be enabled in the setup phase
  const canConfirm = selectedOpponentId !== null && topicMode !== null && (topicMode === 'any' || selectedTopicId !== null)

  const handleSetupConfirm = () => {
    if (!canConfirm || !currentTeam) {
      return
    }

    const nextOpponentTeam = teams.find((team) => team.id === selectedOpponentId) ?? null

    if (!nextOpponentTeam) {
      console.error(`[ChallengeSetup] Invalid opponent team ID: ${selectedOpponentId}`)
      finishTurn()
      return
    }

    const pickTopic = () => {
      if (topicMode === 'specific') {
        return questionTiles.find((tile) => tile.id === selectedTopicId) ?? null
      }

      return questionTiles[Math.floor(Math.random() * questionTiles.length)] ?? null
    }

    const q1 = getRandomQuestionForTile(pickTopic(), questions, answers)
    const q2 = getRandomQuestionForTile(pickTopic(), questions, answers)
    const selectedQuestions = [q1, q2].filter(Boolean)

    if (selectedQuestions.length === 0) {
      console.error('[ChallengeSetup] Failed to select valid questions for the challenge.')
      finishTurn()
      return
    }

    setOpponentTeam(nextOpponentTeam)
    setChallengeQuestions(selectedQuestions)
    setChallengeResult(null)
    setPhase('question')
    setCurrentQuestionIndex(0)
  }

  const handleSelectTopicMode = (mode) => {
    setTopicMode(mode)
    if (mode === 'any') {
      setSelectedTopicId(null)
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

  const handleQuestionsConfirm = () => {
    if (!canConfirmQuestion || !currentTeam || !opponentTeam) {
      return
    }

    // If there are more questions to answer, just move to the next one
    if (currentQuestionIndex !== challengeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      return
    }

    const correctnessTuples = challengeQuestions.map((question, index) => {
      const answerSet = questionAnswers[index] ?? { activeTeamAnswer: null, opponentTeamAnswer: null }
      const activeIsCorrect = question.answer === answerSet.activeTeamAnswer
      const opponentIsCorrect = question.answer === answerSet.opponentTeamAnswer

      saveAnswer({
        questionId: question.id,
        teamId: currentTeam.id,
        isCorrect: activeIsCorrect
      })

      saveAnswer({
        questionId: question.id,
        teamId: opponentTeam.id,
        isCorrect: opponentIsCorrect
      })

      return [activeIsCorrect, opponentIsCorrect]
    })

    const activeCorrectCount = correctnessTuples.filter(([activeIsCorrect]) => activeIsCorrect).length
    const opponentCorrectCount = correctnessTuples.filter(([, opponentIsCorrect]) => opponentIsCorrect).length

    let activePointsDelta = 0
    let opponentPointsDelta = 0
    let outcome = 'draw'

    if (activeCorrectCount > opponentCorrectCount) {
      outcome = 'active-wins'
      activePointsDelta = board.score_challenge_winner
      opponentPointsDelta = board.score_challenge_loser
    } else if (activeCorrectCount < opponentCorrectCount) {
      outcome = 'opponent-wins'
      activePointsDelta = board.score_challenge_loser
      opponentPointsDelta = board.score_challenge_winner
    } else {
      activePointsDelta = board.score_challenge_draw_attacker
      opponentPointsDelta = board.score_challenge_draw_defender
    }

    updateScore(currentTeam.id, activePointsDelta)
    updateScore(opponentTeam.id, opponentPointsDelta)
    setChallengeResult({
      outcome,
      activeCorrectCount,
      opponentCorrectCount,
      activePointsDelta,
      opponentPointsDelta,
      correctnessTuples
    })
    setPhase('result')
  }

  const handleClose = () => {
    setSelectedOpponentId(null)
    setTopicMode(null)
    setSelectedTopicId(null)
    setPhase('setup')
    setCurrentQuestionIndex(0)
    setOpponentTeam(null)
    setChallengeQuestions([])
    setChallengeResult(null)
    setQuestionAnswers(emptyQuestionAnswers)

    finishTurn()
  }

  const dialogClassName = cn(
    'fixed inset-0 m-auto w-full rounded-2xl border border-border bg-card p-0 shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm',
    phase === 'result' ? 'max-w-4xl' : 'max-w-xl'
  )

  const optionButtonClassName = (selected) => cn(
    'rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all',
    selected
      ? 'border-primary bg-primary text-primary-foreground'
      : 'border-border bg-secondary text-foreground hover:border-primary/50 hover:bg-primary-200'
  )

  if (turnPhase !== TURN_PHASES.CHALLENGE) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => e.preventDefault()} // evita que el modal se cierre al hacer click fuera o presionar Esc
      className={dialogClassName}
      aria-modal="true" aria-label="Challenge setup modal"
    >
      {phase === 'setup' && (
        <>
          <header className="border-b border-border px-6 pt-6 pb-4">
            <p className="mb-1 text-sm font-medium text-muted-foreground">{currentTeamName} challenge turn</p>
            <h2 className="font-display text-2xl font-bold text-primary">Challenge setup</h2>
          </header>

          <div className="flex flex-col gap-6 px-6 py-6">
            <section className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Choose an opponent</p>
              <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Opponent team">
                {availableTeams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    className={optionButtonClassName(selectedOpponentId === team.id)}
                    onClick={() => setSelectedOpponentId(team.id)}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Choose a question topic</p>
              <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Question topic mode">
                <button
                  type="button"
                  className={optionButtonClassName(topicMode === 'any')}
                  onClick={() => handleSelectTopicMode('any')}
                >
                  Any topic
                </button>
                <button
                  type="button"
                  className={optionButtonClassName(topicMode === 'specific')}
                  onClick={() => handleSelectTopicMode('specific')}
                >
                  Choose topic
                </button>
              </div>

              {topicMode === 'specific' && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3" role="group" aria-label="Specific question topic">
                  {questionTiles.map((tile) => {
                    const iconUrl = getTileIconPublicUrl(tile.icon)
                    const isSelected = selectedTopicId === tile.id

                    return (
                      <button
                        key={tile.id}
                        type="button"
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-3 text-center transition-all',
                          isSelected
                            ? 'border-primary bg-primary-200 text-primary-700'
                            : 'border-border bg-secondary text-foreground hover:border-primary/40 hover:bg-primary-200'
                        )}
                        onClick={() => setSelectedTopicId(tile.id)}
                      >
                        <span
                          className={cn(
                            'inline-flex size-12 items-center justify-center overflow-hidden rounded-full border text-lg font-bold',
                            isSelected
                              ? 'border-primary-700 bg-primary-350 text-primary-foreground'
                              : 'border-border bg-card text-foreground'
                          )}
                          aria-hidden="true"
                        >
                          {iconUrl && !failedIcons.has(tile.id) ? (
                            <img
                              src={iconUrl}
                              alt=""
                              loading="lazy"
                              className="size-full object-cover"
                              onError={() => setFailedIcons((prev) => { const next = new Set(prev); next.add(tile.id); return next })}
                            />
                          ) : (
                            tile.name.charAt(0)
                          )}
                        </span>
                        <span className="text-sm font-semibold leading-tight">{tile.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          <footer className="flex justify-end gap-2 border-t border-border px-6 py-4">
            <Button type="button" onClick={handleSetupConfirm} disabled={!canConfirm} size="lg">
              Continue
            </Button>
          </footer>
        </>
      )}

      {phase === 'question' && (
        <>
          <header className="border-b border-border px-6 pt-6 pb-4">
            <p className="mb-1 text-sm font-medium text-muted-foreground">{currentTeamName} vs {opponentTeamName ?? 'Opponent team'}</p>
            <h2 className="font-display text-2xl font-bold text-primary">Challenge question</h2>
          </header>

          <div className="flex flex-col gap-6 px-6 py-6">
            <section className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Challenge question {currentQuestionIndex + 1} of {challengeQuestions.length}
              </p>
              <p className="text-xl font-medium leading-snug text-foreground">
                {currentQuestion?.text ?? 'No question available for this challenge step.'}
              </p>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-xl border border-border bg-secondary p-4">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{currentTeamName}</p>
                <div className="grid grid-cols-2 gap-3" role="group" aria-label={`${currentTeamName} answer`}>
                  <Button
                    type="button"
                    variant={currentAnswerSet.activeTeamAnswer === true ? 'answerTrueSelected' : 'answerTrue'}
                    size="answer"
                    onClick={() => handleActiveTeamAnswer(true)}
                  >
                    TRUE
                  </Button>
                  <Button
                    type="button"
                    variant={currentAnswerSet.activeTeamAnswer === false ? 'answerFalseSelected' : 'answerFalse'}
                    size="answer"
                    onClick={() => handleActiveTeamAnswer(false)}
                  >
                    FALSE
                  </Button>
                </div>
              </section>

              <section className="rounded-xl border border-border bg-secondary p-4">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{opponentTeamName ?? 'Opponent team'}</p>
                <div className="grid grid-cols-2 gap-3" role="group" aria-label={`${opponentTeamName ?? 'Opponent team'} answer`}>
                  <Button
                    type="button"
                    variant={currentAnswerSet.opponentTeamAnswer === true ? 'answerTrueSelected' : 'answerTrue'}
                    size="answer"
                    onClick={() => handleOpponentTeamAnswer(true)}
                  >
                    TRUE
                  </Button>
                  <Button
                    type="button"
                    variant={currentAnswerSet.opponentTeamAnswer === false ? 'answerFalseSelected' : 'answerFalse'}
                    size="answer"
                    onClick={() => handleOpponentTeamAnswer(false)}
                  >
                    FALSE
                  </Button>
                </div>
              </section>
            </div>
          </div>

          <footer className="flex justify-end gap-2 border-t border-border px-6 py-4">
            <Button type="button" onClick={handleQuestionsConfirm} disabled={!canConfirmQuestion} size="lg">
              {currentQuestionIndex === 0 ? 'Next question' : 'Finish answers'}
            </Button>
          </footer>
        </>
      )}

      {phase === 'result' && (
        <>
          <header className="border-b border-border px-5 pt-5 pb-3">
            <p className="mb-1 text-sm font-medium text-muted-foreground">Challenge completed</p>
            <h2 className="font-display text-xl font-bold text-primary">Challenge result</h2>
          </header>

          <div className="flex flex-col gap-4 px-5 py-4">
            <section className="flex flex-col gap-3" aria-live="polite">
              <div className="rounded-xl border-2 border-primary bg-primary-200 p-3 text-center text-primary-700">
                <p className="text-lg font-bold">{getOutcomeText()}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <article className="rounded-xl border border-border bg-secondary p-3">
                  <p className="text-base font-bold text-foreground">{currentTeamName}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Correct answers: {challengeResult?.activeCorrectCount ?? 0}</p>
                  <p className={cn(
                    'mt-1 text-lg font-bold',
                    (challengeResult?.activePointsDelta ?? 0) > 0
                      ? 'text-success-700'
                      : (challengeResult?.activePointsDelta ?? 0) < 0
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                  )}>Points: {formatPointsDelta(challengeResult?.activePointsDelta ?? 0)}</p>
                </article>
                <article className="rounded-xl border border-border bg-secondary p-3">
                  <p className="text-base font-bold text-foreground">{opponentTeamName}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Correct answers: {challengeResult?.opponentCorrectCount ?? 0}</p>
                  <p className={cn(
                    'mt-1 text-lg font-bold',
                    (challengeResult?.opponentPointsDelta ?? 0) > 0
                      ? 'text-success-700'
                      : (challengeResult?.opponentPointsDelta ?? 0) < 0
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                  )}>Points: {formatPointsDelta(challengeResult?.opponentPointsDelta ?? 0)}</p>
                </article>
              </div>

              <div className="flex flex-col gap-2.5">
                {challengeQuestions.map((question, index) => {
                  const answerSet = questionAnswers[index] ?? { activeTeamAnswer: null, opponentTeamAnswer: null }
                  const correctnessTuple = challengeResult?.correctnessTuples?.[index] ?? [false, false]
                  const [activeIsCorrect, opponentIsCorrect] = correctnessTuple

                  return (
                    <article key={question.id} className="rounded-xl border border-border bg-card p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Question {index + 1}</p>
                      <p className="mt-0.5 text-base font-medium leading-snug text-foreground">{question.text}</p>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        Correct answer: <strong className="text-foreground">{question.answer ? 'TRUE' : 'FALSE'}</strong>
                      </p>

                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <div className={cn(
                          'flex items-center justify-between rounded-lg border px-3 py-1.5 text-sm font-semibold',
                          activeIsCorrect
                            ? 'border-success bg-success-200 text-success-700'
                            : 'border-destructive bg-destructive-200 text-destructive-700'
                        )}>
                          <span>{currentTeamName}</span>
                          <span>{answerSet.activeTeamAnswer ? 'TRUE' : 'FALSE'}</span>
                        </div>
                        <div className={cn(
                          'flex items-center justify-between rounded-lg border px-3 py-1.5 text-sm font-semibold',
                          opponentIsCorrect
                            ? 'border-success bg-success-200 text-success-700'
                            : 'border-destructive bg-destructive-200 text-destructive-700'
                        )}>
                          <span>{opponentTeamName}</span>
                          <span>{answerSet.opponentTeamAnswer ? 'TRUE' : 'FALSE'}</span>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          </div>

          <footer className="flex justify-end gap-2 border-t border-border px-5 py-3">
            <Button variant="secondary" type="button" onClick={handleClose} size="lg">
              Close
            </Button>
          </footer>
        </>
      )}
    </dialog>
  )
}
