import { useState } from 'react'
import { updateBoardById } from '@/services/boards'

export function useBoardScoringEditor({ board }) {
  const getScoringFromBoard = (sourceBoard) => ({
    scoreCorrect: sourceBoard?.score_correct ?? 0,
    scoreIncorrect: sourceBoard?.score_incorrect ?? 0,
    scoreAttack: sourceBoard?.score_attack ?? 0,
    scoreChallengeWinner: sourceBoard?.score_challenge_winner ?? 0,
    scoreChallengeLoser: sourceBoard?.score_challenge_loser ?? 0,
    scoreChallengeDrawDefender: sourceBoard?.score_challenge_draw_defender ?? 0,
    scoreChallengeDrawAttacker: sourceBoard?.score_challenge_draw_attacker ?? 0,
  })

  // Edit mode + save state
  const [isEditingScoring, setIsEditingScoring] = useState(false)
  const [isSavingScoring, setIsSavingScoring] = useState(false)

  // Score draft
  const [draftScoring, setDraftScoring] = useState(() => getScoringFromBoard(board))

  const startScoringEdit = () => {
    setDraftScoring(getScoringFromBoard(board))
    setIsEditingScoring(true)
  }

  const cancelScoringEdit = () => {
    setDraftScoring(getScoringFromBoard(board))
    setIsEditingScoring(false)
  }

  const updateDraftScoring = (updates) => {
    setDraftScoring((current) => ({ ...current, ...updates }))
  }

  const saveScoring = async () => {
    // No-op guard: avoid update when the user did not change any score.
    const currentScoring = getScoringFromBoard(board)
    const hasChanges = (
      draftScoring.scoreCorrect !== currentScoring.scoreCorrect
      || draftScoring.scoreIncorrect !== currentScoring.scoreIncorrect
      || draftScoring.scoreAttack !== currentScoring.scoreAttack
      || draftScoring.scoreChallengeWinner !== currentScoring.scoreChallengeWinner
      || draftScoring.scoreChallengeLoser !== currentScoring.scoreChallengeLoser
      || draftScoring.scoreChallengeDrawDefender !== currentScoring.scoreChallengeDrawDefender
      || draftScoring.scoreChallengeDrawAttacker !== currentScoring.scoreChallengeDrawAttacker
    )

    if (!hasChanges) {
      setIsEditingScoring(false)
      return { changed: false }
    }

    setIsSavingScoring(true)

    try {
      const updatedBoard = await updateBoardById({
        boardId: board.id,
        updates: {
          score_correct: draftScoring.scoreCorrect,
          score_incorrect: draftScoring.scoreIncorrect,
          score_attack: draftScoring.scoreAttack,
          score_challenge_winner: draftScoring.scoreChallengeWinner,
          score_challenge_loser: draftScoring.scoreChallengeLoser,
          score_challenge_draw_defender: draftScoring.scoreChallengeDrawDefender,
          score_challenge_draw_attacker: draftScoring.scoreChallengeDrawAttacker,
        },
      })
      setIsEditingScoring(false)
      return { changed: true, board: updatedBoard }
    } finally {
      setIsSavingScoring(false)
    }
  }

  return {
    scoring: getScoringFromBoard(board),
    isEditingScoring,
    isSavingScoring,
    draftScoring,
    startScoringEdit,
    cancelScoringEdit,
    updateDraftScoring,
    saveScoring,
  }
}
