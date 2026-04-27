import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon } from '@hugeicons/core-free-icons';

import BoardGrid from './components/BoardGrid'
import BoardSidebar from './components/BoardSidebar'
import QuestionModal from './components/QuestionModal'
import ChallengeModal from './components/ChallengeModal'
import GameOverModal from './components/GameOverModal'
import { fetchFirstBoard, fetchCategories, fetchBoardCategory, fetchQuestions } from '@/services/api'

const TEAMS = [
  { id: 1, slug: 'team-1', name: 'Team 1', score: 0, position: 0, color: '#a855f7' },
  { id: 2, slug: 'team-2', name: 'Team 2', score: 0, position: 0, color: '#68ec68' },
  { id: 3, slug: 'team-3', name: 'Team 3', score: 0, position: 0, color: '#5e9eff' },
  { id: 4, slug: 'team-4', name: 'Team 4', score: 0, position: 0, color: '#e47a30' },
]
const ANSWERS = [
  { question_id: 1, game_id: 1, team_id: 1, is_correct: true },
  { question_id: 3, game_id: 1, team_id: 1, is_correct: false },
  { question_id: 6, game_id: 1, team_id: 1, is_correct: true }
]

const TURN_PHASES = {
  IDLE: 'idle',
  TILE_INFO: 'tile_info',
  QUESTION: 'question',
  CHALLENGE: 'challenge',
  FINISHED: 'finished',
  GAME_OVER: 'game_over'
}

function BoardPage() {
  const [board, setBoard] = useState(null)
  const [teams, setTeams] = useState(TEAMS)
  const [categories, setCategories] = useState([])
  const [boardCategory, setBoardCategory] = useState([])
  const [questions, setQuestions] = useState([])
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [dieValue, setDieValue] = useState(1)
  const [turnPhase, setTurnPhase] = useState(TURN_PHASES.IDLE)
  const [challengeData, setChallengeData] = useState(null)
  const [winnerTeamId, setWinnerTeamId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const questionCategories = categories.filter((category) => category.type === 'question')

  useEffect(() => {
    const loadGameData = async () => {
      try {
        const [dbBoard, dbCategories, dbBoardCategory, dbQuestions] = await Promise.all([
          fetchFirstBoard(),
          fetchCategories(),
          fetchBoardCategory(),
          fetchQuestions()
        ])
        if (!dbBoard || dbCategories.length === 0 || dbBoardCategory.length === 0 || dbQuestions.length === 0) {
          console.error('[BoardPage] Incomplete game data from Supabase.', {
            boardFound: Boolean(dbBoard),
            categoriesCount: dbCategories.length,
            boardCategoryCount: dbBoardCategory.length,
            questionsCount: dbQuestions.length,
            hint: 'Check RLS policies/table data for boards, categories, board_category, and questions.'
          })
          setLoadError('Game data could not be loaded. Check your Supabase connection and RLS policies.')
          return
        }
        setBoard(dbBoard)
        setCategories(dbCategories)
        setBoardCategory(dbBoardCategory)
        setQuestions(dbQuestions)
      } catch (error) {
        console.error('[BoardPage] Failed to load game data from Supabase.', {
          name: error?.name,
          message: error?.message,
          stack: error?.stack
        })
        setLoadError('Failed to load game data. Please try again.')
      } finally {
        setIsLoading(false)
        // setLoadError('Failed to load game data. Please try again.')
      }
    }

    loadGameData()
  }, [])

  const getRandomQuestionForCategory = (category) => {
    if (!category || category.type !== 'question') return null

    const categoryQuestions = questions.filter((question) => question.category_id === category.id)
    if (categoryQuestions.length === 0) {
      console.warn(`[QuestionPool] No questions found for category "${category.name}".`)
      return null
    }

    const answeredQuestionIds = new Set(ANSWERS.map((answer) => answer.question_id))
    const unansweredQuestions = categoryQuestions.filter((question) => {
      const isAlreadyAnswered = answeredQuestionIds.has(question.id)

      return !isAlreadyAnswered
    })

    const availableQuestions = unansweredQuestions.length > 0
      ? unansweredQuestions
      : categoryQuestions

    if (unansweredQuestions.length === 0) {
      console.warn(
        `[QuestionPool] Category "${category.name}" is exhausted. Reusing previously answered questions.`
      )
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    return availableQuestions[randomIndex]
  }

  const registerAnswer = ({ questionId, teamId, isCorrect }) => {
    ANSWERS.push({
      question_id: questionId,
      game_id: 1, // assuming a single game for now
      team_id: teamId,
      is_correct: isCorrect
    })
  }

  const handleNextTurn = () => {
    const nextTeamIndex = (currentTeamIndex + 1) % teams.length
    setCurrentTeamIndex(nextTeamIndex)
    setCurrentQuestion(null)
    setTurnPhase(TURN_PHASES.IDLE)
  }

  const handleChallengeSetupConfirm = (setup) => {
    const opponentTeam = teams.find((team) => team.id === setup.opponentTeamId) ?? null

    if (!opponentTeam) {
      console.error(`[ChallengeSetup] Invalid opponent team ID: ${setup.opponentTeamId}`)
      handleFinishTurn() // end challenge immediately on error
      return
    }

    const pickCategory = () => {
      if (setup.categoryId) {
        return questionCategories.find((category) => category.id === setup.categoryId) ?? null
      }
      return questionCategories[Math.floor(Math.random() * questionCategories.length)] ?? null
    }

    const q1 = getRandomQuestionForCategory(pickCategory())
    const q2 = getRandomQuestionForCategory(pickCategory())
    const selectedQuestions = [q1, q2].filter(Boolean)

    if (selectedQuestions.length === 0) {
      console.error(`[ChallengeSetup] Failed to select valid questions for the challenge.`)
      handleFinishTurn() // end challenge immediately on error
      return
    }

    setChallengeData({
      opponentTeam,
      questions: selectedQuestions
    })
  }

  const handleChallengeQuestionsAnswered = (answers) => {
    const activeTeam = teams[currentTeamIndex]
    const opponentTeam = challengeData.opponentTeam
    const challengeQuestions = challengeData.questions ?? []

    const correctnessTuples = challengeQuestions.map((question, index) => {
      const answerSet = answers[index] ?? { activeTeamAnswer: null, opponentTeamAnswer: null }
      const activeIsCorrect = question.answer === answerSet.activeTeamAnswer
      const opponentIsCorrect = question.answer === answerSet.opponentTeamAnswer

      registerAnswer({
        questionId: question.id,
        teamId: activeTeam.id,
        isCorrect: activeIsCorrect
      })

      registerAnswer({
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
      outcome = 'draw'
      activePointsDelta = board.score_challenge_draw_attacker
      opponentPointsDelta = board.score_challenge_draw_defender
    }

    setTeams((previousTeams) => {
      return previousTeams.map((team) => {
        if (team.id === activeTeam.id) {
          return {
            ...team,
            score: team.score + activePointsDelta
          }
        }

        if (team.id === opponentTeam.id) {
          return {
            ...team,
            score: team.score + opponentPointsDelta
          }
        }

        return team
      })
    })

    setChallengeData((previousData) => {
      if (!previousData) {
        return previousData
      }

      return {
        ...previousData,
        result: {
          outcome,
          activeCorrectCount,
          opponentCorrectCount,
          activePointsDelta,
          opponentPointsDelta,
          correctnessTuples
        }
      }
    })
  }

  const handleRollDice = (rolledValue) => {
    if (turnPhase !== TURN_PHASES.IDLE || turnPhase === TURN_PHASES.GAME_OVER) {
      return
    }

    const dieValue = Number.isInteger(rolledValue)
      ? rolledValue
      : Math.floor(Math.random() * 6) + 1
    // const dieValue = 7 // fixed value for testing
    setDieValue(dieValue)

    const currentTeamPosition = teams[currentTeamIndex].position
    const nextPosition = Math.min(currentTeamPosition + dieValue, 30)
    const reachedGoal = nextPosition === 30
    const activeTeamId = teams[currentTeamIndex].id

    setTeams((previousTeams) =>
      previousTeams.map((team, index) => {
        if (index === currentTeamIndex) {
          return { ...team, position: nextPosition }
        }
        return team
      })
    )

    if (reachedGoal) {
      setWinnerTeamId(activeTeamId)
      setCurrentCategory(null)
      setCurrentQuestion(null)
      setChallengeData(null)
      setTurnPhase(TURN_PHASES.GAME_OVER)
      return
    }

    const tileAtNextPosition = boardCategory.find((tile) => tile.position === nextPosition)
    const categoryId = tileAtNextPosition?.category_id
    const nextCategory = categoryId
      ? categories.find((category) => category.id === categoryId) ?? null
      : null
    setCurrentCategory(nextCategory)

    const nextQuestion = getRandomQuestionForCategory(nextCategory)
    setCurrentQuestion(nextQuestion)

    setTurnPhase(TURN_PHASES.TILE_INFO)
  }

  const handleFinishTurn = () => {
    if (turnPhase === TURN_PHASES.GAME_OVER) {
      return
    }

    setTurnPhase(TURN_PHASES.FINISHED)
  }

  const handleQuestionAnswer = (selectedAnswer) => {
    if (!currentQuestion) {
      return null
    }

    const isCorrect = currentQuestion.answer === selectedAnswer
    const pointsDelta = isCorrect ? board.score_correct : board.score_incorrect

    setTeams((previousTeams) =>
      previousTeams.map((team) => {
        if (team.id === teams[currentTeamIndex].id) {
          return {
            ...team,
            score: team.score + pointsDelta
          }
        }

        return team
      })
    )

    registerAnswer({
      questionId: currentQuestion.id,
      teamId: teams[currentTeamIndex].id,
      isCorrect
    })

    return {
      isCorrect,
      pointsDelta,
      correctAnswer: currentQuestion.answer
    }
  }

  const handleStartTileAction = () => {
    switch (currentCategory?.type) {
      case 'question':
        setTurnPhase(TURN_PHASES.QUESTION)
        break
      case 'special':
        switch (currentCategory.name.toLowerCase()) {
          case 'pipe':
            setTurnPhase(TURN_PHASES.IDLE)
            break
          case 'attack':
            setTeams((previousTeams) =>
              previousTeams.map((team, index) => {
                if (index === currentTeamIndex) {
                  return {
                    ...team,
                    score: team.score + board.score_attack
                  }
                }

                return team
              })
            )
            handleFinishTurn()
            break
          case 'challenge':
            setTurnPhase(TURN_PHASES.CHALLENGE)
            break
        }
        break
      default:
        handleFinishTurn()
    }
  }

  if (isLoading) {
    return (
      <main className="w-screen h-screen bg-bg flex items-center justify-center">
        <h2 className="text-xl font-medium">Loading game data…</h2>
      </main>
    )
  }
  if (loadError) {
    return (
      <main className="flex flex-col items-center justify-center gap-2 w-screen h-screen bg-background animate-in fade-in zoom-in" aria-label="Error loading game">
        <div className='flex-center bg-secondary size-12 rounded-full'>
          <HugeiconsIcon icon={Alert02Icon} />
        </div>
        <h2 className="text-xl font-semibold text-wrap">Data loading error</h2>
        <p className="text-lg mx-12 text-center">{loadError}</p>
        <Button className="mt-2" size='lg' onClick={() => window.location.reload()}>
          Retry
        </Button>
      </main>
    )
  }
  return (

    <main className="flex flex-col max-w-screen h-screen" aria-label="Game screen">
      <header className="p-12 flex items-center justify-center" aria-label="Game header">
        <h1 className="text-5xl font-display font-extrabold text-primary">{board.name.toUpperCase()}</h1>
      </header>

      <section className="flex-1 flex flex-col gap-12 lg:gap-0 lg:flex-row" aria-label="Main game area">
        <div className="flex justify-center lg:w-2/3 lg:mb-16 h-160 lg:h-auto">
          <BoardGrid
            className="w-[75%]"
            teams={teams}
            currentTeamId={teams[currentTeamIndex].id}
            boardCategory={boardCategory}
            categories={categories}
          />
        </div>
        <BoardSidebar
          className="lg:w-1/3"
          teams={teams}
          currentTeamId={teams[currentTeamIndex].id}
          onNextTurn={handleNextTurn}
          onRollDice={handleRollDice}
          onStartTileAction={handleStartTileAction}
          diceValue={dieValue}
          turnPhase={turnPhase}
          currentCategory={currentCategory}
        />
      </section>

      {turnPhase === TURN_PHASES.QUESTION && (
        <QuestionModal
          onFinishTurn={handleFinishTurn}
          onConfirmAnswer={handleQuestionAnswer}
          questionText={currentQuestion?.text}
          currentTeamName={teams[currentTeamIndex].name}
        />
      )}

      {turnPhase === TURN_PHASES.CHALLENGE && (
        <ChallengeModal
          currentTeamName={teams[currentTeamIndex].name}
          opponentTeamName={challengeData?.opponentTeam?.name ?? null}
          availableTeams={teams.filter((team) => team.id !== teams[currentTeamIndex].id)}
          questionCategories={questionCategories}
          challengeQuestions={challengeData?.questions ?? []}
          challengeResult={challengeData?.result ?? null}
          onConfirmSetup={handleChallengeSetupConfirm}
          onQuestionsAnswered={handleChallengeQuestionsAnswered}
          onClose={() => {
            setChallengeData(null)
            handleFinishTurn()
          }}
        />
      )}

      {turnPhase === TURN_PHASES.GAME_OVER && (
        <GameOverModal
          teams={teams}
          winnerTeamId={winnerTeamId}
        />
      )}

    </main>
  )
}

export default BoardPage
