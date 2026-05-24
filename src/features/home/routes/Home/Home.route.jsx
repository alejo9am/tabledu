import { Link } from "react-router-dom"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Icon } from "@/components/ui/Icon"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { fetchBoards } from "@/services/boards"
import { fetchGames } from "@/services/games"
import { fetchQuestions } from "@/services/questions"
import {
  AddCircleIcon,
  PlayCircleIcon,
  DashboardSquare02Icon,
  Quiz05Icon,
  SchoolIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"

const onboardingSteps = [
  {
    number: "01",
    title: "Create board",
    description: "Set your board name and structure for the class challenge.",
    to: "/boards/new",
  },
  {
    number: "02",
    title: "Add questions",
    description: "Build question tiles so students learn while they advance.",
    to: "/tiles/questions",
  },
  {
    number: "03",
    title: "Play with your class",
    description: "Start a game session and turn your lesson into action.",
    to: "/games",
  },
]

const baseOverviewCards = [
  {
    title: "Boards",
    key: "boards",
    value: "0",
    hint: "Design your first board",
    icon: DashboardSquare02Icon,
  },
  {
    title: "Question Tiles",
    value: "Build your bank",
    hint: "Prepare reusable prompts",
    icon: Quiz05Icon,
  },
  {
    title: "Game Sessions",
    value: "Start in minutes",
    hint: "Run live classroom games",
    icon: PlayCircleIcon,
  },
]

function HomePage() {
  const { user } = useAuth()
  const [boards, setBoards] = useState([])
  const [isLoadingBoards, setIsLoadingBoards] = useState(true)
  const [hasQuestions, setHasQuestions] = useState(false)
  const [hasGames, setHasGames] = useState(false)

  const loadBoards = useCallback(async () => {
    setIsLoadingBoards(true)

    try {
      if (!user?.id) {
        setBoards([])
        setHasQuestions(false)
        setHasGames(false)
        return
      }

      const [boardsData, questionsData, gamesData] = await Promise.all([
        fetchBoards(),
        fetchQuestions(),
        fetchGames(),
      ])

      setBoards(boardsData)
      setHasQuestions((questionsData ?? []).length > 0)
      setHasGames((gamesData ?? []).length > 0)
    } catch {
      setBoards([])
      setHasQuestions(false)
      setHasGames(false)
    } finally {
      setIsLoadingBoards(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadBoards()
  }, [loadBoards])

  const recentBoards = useMemo(() => boards.slice(0, 3), [boards])
  const hasBoards = boards.length > 0
  const onboardingStepsWithStatus = useMemo(() => {
    return onboardingSteps.map((step) => {
      if (step.number === "01") {
        return { ...step, isDone: hasBoards }
      }

      if (step.number === "02") {
        return { ...step, isDone: hasQuestions }
      }

      return { ...step, isDone: hasGames }
    })
  }, [hasBoards, hasGames, hasQuestions])
  const shouldShowOnboarding = useMemo(
    () => !isLoadingBoards && onboardingStepsWithStatus.some((step) => !step.isDone),
    [isLoadingBoards, onboardingStepsWithStatus]
  )

  const overviewCards = useMemo(() => {
    return baseOverviewCards.map((card) => {
      if (card.key !== "boards") {
        return card
      }

      return {
        ...card,
        value: isLoadingBoards ? "..." : String(boards.length),
        hint: boards.length > 0 ? "Keep building your collection" : "Design your first board",
      }
    })
  }, [boards.length, isLoadingBoards])

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0" aria-label="Home page">
      <div className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-16 -right-12 size-56 rounded-full bg-warning blur-3xl" />
        <div className="pointer-events-none absolute top-6 right-1/3 size-28 rounded-full bg-primary blur-2xl" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 size-44 -translate-x-1/2 rounded-full bg-destructive blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 size-64 rounded-full bg-primary blur-3xl" />
        <div className="pointer-events-none absolute bottom-8 left-1/3 size-24 rounded-full bg-warning blur-2xl" />
        <div className="pointer-events-none absolute bottom-5 right-12 size-28 rounded-full bg-destructive blur-2xl" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-background/78 via-background/48 to-background/68" />

        <div className="relative grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-3xl border bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
              <Icon icon={SchoolIcon} className="size-3.5 text-primary" />
              Build playful lessons with Tabledu
            </span>

            <div className="space-y-3">
              <h1 className="font-display text-3xl leading-tight font-medium text-foreground sm:text-4xl">
                Turn your class into a board game
              </h1>
              <p className="max-w-2xl text-sm sm:text-base">
                Create boards, add meaningful questions, and launch game sessions that transform study time into
                active learning.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild variant="warning" size="lg" className="w-full sm:w-auto">
                <Link to="/boards/new">
                  <Icon icon={AddCircleIcon} className="size-4" />
                  Create Board
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full bg-card/70 sm:w-auto">
                <Link to="/games">
                  <Icon icon={PlayCircleIcon} className="size-4" />
                  Start Game Session
                </Link>
              </Button>
            </div>
          </div>

          {shouldShowOnboarding ? (
            <div className="rounded-2xl border bg-background/80 p-4 sm:p-5">
              <p className="text-sm font-semibold text-foreground">Getting Started</p>
              <div className="mt-4 space-y-3">
                {onboardingStepsWithStatus.map((step) => (
                  <Link
                    key={step.number}
                    to={step.to}
                    className={[
                      "block rounded-xl border bg-card px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-primary-200/15",
                      step.isDone ? "border-success/40 bg-success-200/35 hover:border-success/55 hover:bg-success-200/50" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold tracking-wide text-primary">{step.number}</p>
                      {step.isDone ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success-700">
                          <span className="size-1.5 rounded-full bg-success" />
                          Done
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {overviewCards.map((card) => (
          <article key={card.title} className="rounded-2xl border bg-card p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{card.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
              </div>
              <span className="inline-flex items-center justify-center rounded-xl bg-primary-200 p-2 text-primary-700">
                <Icon icon={card.icon} className="size-4" />
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl text-foreground">Recent Boards</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/boards">Go to Boards</Link>
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Jump back into your latest board activities.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isLoadingBoards
            ? [1, 2, 3].map((item) => (
              <div key={item} className="rounded-xl border border-dashed bg-background/80 p-4">
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-40 animate-pulse rounded bg-muted" />
              </div>
            ))
            : null}

          {!isLoadingBoards && recentBoards.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-background/80 p-4 sm:col-span-2 lg:col-span-3">
              <p className="text-sm font-semibold text-foreground">No boards yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Create a board to unlock this space.</p>
            </div>
          ) : null}

          {!isLoadingBoards
            ? recentBoards.map((board) => (
              <Link
                key={board.id}
                to={`/boards/${board.id}`}
                className="rounded-xl border bg-background/80 p-4 transition-colors hover:border-primary/40 hover:bg-primary-200/20"
              >
                <p className="line-clamp-1 text-sm font-semibold text-foreground">{board.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {board.description || "No description yet."}
                </p>
                <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Open board
                  <Icon icon={ArrowRight01Icon} className="size-3.5" />
                </p>
              </Link>
            ))
            : null}
        </div>
      </div>
    </section>
  )
}

export default HomePage
