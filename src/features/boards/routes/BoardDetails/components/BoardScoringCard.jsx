import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function BoardScoringCard({ board, isLoading = false }) {
  const formatScore = (value) => {
    if (typeof value !== "number") return "--"
    return value > 0 ? `+${value}` : `${value}`
  }

  const scoreRowClassName = (value) => {
    const toneClass = value >= 0
      ? "border-success text-success-700"
      : "border-destructive text-destructive-700"

    return `flex items-center justify-between bg-card rounded-md border-2 px-2.5 py-1.5 sm:px-3 sm:py-2 ${toneClass}`
  }

  const questionRules = [
    { label: "Correct", value: board?.score_correct },
    { label: "Incorrect", value: board?.score_incorrect },
  ]

  const challengeRules = [
    { label: "Win", value: board?.score_challenge_winner },
    { label: "Loss", value: board?.score_challenge_loser },
  ]

  const challengeDrawRules = [
    { label: "Draw Defender", value: board?.score_challenge_draw_defender },
    { label: "Draw Attacker", value: board?.score_challenge_draw_attacker },
  ]

  return (
    <article className="rounded-xl border bg-card p-3 sm:p-5 lg:col-span-8">
      <>
        <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
          <h2 className="text-base font-semibold sm:text-xl">Scoring Rules</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge>BALANCED</Badge>
            </TooltipTrigger>
            <TooltipContent>
              Current score configuration is balanced
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2">
          { isLoading ? (
            <Skeleton className="h-28 w-full rounded-lg sm:h-32" />
          ) : (
            <div className="rounded-lg bg-primary-200 p-2.5 sm:p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-850">Question</p>
              <div className="space-y-1.5 sm:space-y-2">
                {questionRules.map((item) => (
                  <div key={item.label} className={scoreRowClassName(item.value)}>
                    <span className="text-xs font-medium sm:text-sm">{item.label}</span>
                    <span className="text-sm font-bold sm:text-base">
                      {formatScore(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          { isLoading ? (
            <Skeleton className="h-56 w-full rounded-lg sm:h-64 md:row-span-2" />
          ) : (
            <div className="rounded-lg bg-warning-200 p-2.5 sm:p-3 md:row-span-2">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-warning-850">Challenge</p>
              <div className="space-y-1.5 sm:space-y-2">
                {challengeRules.map((item) => (
                  <div key={item.label} className={scoreRowClassName(item.value)}>
                    <span className="text-xs font-medium sm:text-sm">{item.label}</span>
                    <span className="text-sm font-bold sm:text-base">
                      {formatScore(item.value)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 rounded-md border-2 border-warning-700 border-dashed p-2 sm:mt-3 sm:p-2.5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-warning-850">Challenge Draw</p>
                <div className="space-y-1.5 sm:space-y-2">
                  {challengeDrawRules.map((item) => (
                    <div key={item.label} className={scoreRowClassName(item.value)}>
                      <span className="text-xs font-medium sm:text-sm">{item.label}</span>
                      <span className="text-sm font-bold sm:text-base">
                        {formatScore(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          { isLoading ? (
            <Skeleton className="h-20 w-full rounded-lg sm:h-24" />
          ) : (
            <div className="rounded-lg bg-destructive-200 p-2.5 sm:p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-destructive-850">Attack</p>
              <div className={scoreRowClassName(board?.score_attack)}>
                <span className="text-xs font-medium sm:text-sm">Penalty</span>
                <span className="text-sm font-bold text-destructive sm:text-base">{formatScore(board?.score_attack)}</span>
              </div>
            </div>
          )}
        </div>
      </>
    </article>
  )
}

export default BoardScoringCard
