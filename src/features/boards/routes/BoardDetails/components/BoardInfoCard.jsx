import { Link } from 'react-router-dom'
import { Alert02Icon, Cancel01Icon, CheckmarkCircle02Icon, Edit02Icon, PlayCircleIcon } from '@hugeicons/core-free-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

function formatSessionLabel(session) {
  const date = new Date(session.updated_at ?? session.created_at)
  const dateLabel = Number.isNaN(date.getTime())
    ? 'Session'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  const teamLabel = session.teamCount === 1 ? '1 team' : `${session.teamCount} teams`

  return {
    dateLabel,
    teamLabel,
  }
}

function BoardInfoCard({
  boardId,
  isLoading,
  name,
  description,
  questionTiles = [],
  hasActiveEditor = false,
  sessions = [],
  isEditingInfo,
  isSavingInfo,
  draftInfo = { name: '', description: '' },
  onEditInfo,
  onCancelInfo,
  onDraftInfoChange,
  onSaveInfo,
}) {
  const questionCount = questionTiles.reduce((total, tile) => total + (tile.questionCount ?? 0), 0)
  const emptyQuestionTileCount = questionTiles.filter((tile) => (tile.questionCount ?? 0) === 0).length
  const warningLabel = emptyQuestionTileCount === 1
    ? '1 tile has no questions'
    : `${emptyQuestionTileCount} tiles have no questions`
  const areGameActionsBlocked = isLoading || emptyQuestionTileCount > 0 || hasActiveEditor

  const canSaveInfo = draftInfo.name.trim().length > 0 && draftInfo.description.trim().length > 0 && !isSavingInfo

  return (
    <article className="rounded-2xl border bg-card p-4 lg:col-span-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {isEditingInfo ? (
            <div className="space-y-2">
              <Label htmlFor="board-name" className="sr-only">Board title</Label>
              <Input className="uppercase font-display text-2xl! font-semibold" value={draftInfo.name} onChange={(event) => onDraftInfoChange({ name: event.target.value })} aria-label="Board title" />
              <Textarea value={draftInfo.description} onChange={(event) => onDraftInfoChange({ description: event.target.value })} aria-label="Board description" />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={onCancelInfo} disabled={isSavingInfo}>
                  <Icon icon={Cancel01Icon} className="size-4" />
                  Cancel
                </Button>
                <Button size="sm" onClick={onSaveInfo} disabled={!canSaveInfo}>
                  <Icon icon={CheckmarkCircle02Icon} className="size-4" />
                  {isSavingInfo ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                { isLoading ? (
                  <Skeleton className="h-8 w-2/3" />
                ) : (
                  <h1 className="uppercase truncate font-display text-primary text-3xl font-semibold">{name}</h1>
                )}
                <Button size="icon-xs" variant="ghost" onClick={onEditInfo} aria-label="Edit board info" disabled={isLoading}>
                  <Icon icon={Edit02Icon} className="size-4" />
                </Button>
              </div>
              {isLoading ? (
                <Skeleton className="mt-2 h-5 w-full" />
              ) : (
                <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>
              )}
            </>
          )}
          {isLoading ? (
            <Skeleton className="mt-4 h-6 w-28 rounded-full" />
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="bg-success-200 text-success-700 text-sm">{questionCount} questions</Badge>
              {emptyQuestionTileCount > 0 ? (
                <Badge variant="warning" className="flex gap-1">
                  <Icon icon={Alert02Icon} className="size-3" />
                  {warningLabel}
                </Badge>
              ) : null}
            </div>
          )}
        </div>

        {areGameActionsBlocked ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-not-allowed">
                <Button variant="answerTrueSelected" disabled className="h-20 w-20 flex-col gap-1 rounded-xl">
                  <Icon icon={PlayCircleIcon} className="size-7" />
                  <span className="text-xs leading-tight">New Game</span>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {hasActiveEditor
                ? 'Finish editing before starting a new game.'
                : 'Add at least one question to every question tile before starting a game.'}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button variant="answerTrueSelected" asChild className="h-20 w-20 flex-col gap-1 rounded-xl">
            <Link to={`/games/new/${boardId}`} aria-label="New game">
              <Icon icon={PlayCircleIcon} className="size-7" />
              <span className="text-xs leading-tight">New Game</span>
            </Link>
          </Button>
        )}
      </div>

      <Separator className="my-3" />

      <div>
        <h2 className="uppercase">Game sessions</h2>
        { isLoading ? (
          <Skeleton className="mt-2 h-10 w-32" />
        ) : sessions.length ? (
            <ScrollArea className="mt-2 w-full">
              <div className="flex w-max gap-3 pb-3">
                {sessions.map((session) => {
                  const { dateLabel, teamLabel } = formatSessionLabel(session)
                  const cardClassName = areGameActionsBlocked
                    ? 'cursor-not-allowed opacity-70'
                    : 'hover:opacity-90'

                  const content = (
                    <div className={`flex flex-col rounded-xl bg-accent border px-3 py-2.5 transition-colors ${cardClassName}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="flex p-2 shrink-0 items-center justify-center rounded-full bg-primary text-card">
                          <Icon icon={PlayCircleIcon} className="size-5" />
                        </div>

                        <div className="flex min-w-0 flex-col items-start gap-2">
                          <p className="truncate font-display text-sm leading-none">{dateLabel}</p>
                          <Separator />
                          <p className="text-center text-sm font-medium text-destructive-700">{teamLabel}</p>
                        </div>
                      </div>

                    </div>
                  )

                  if (areGameActionsBlocked) {
                    return (
                      <Tooltip key={session.id}>
                        <TooltipTrigger asChild>
                          <span aria-disabled="true">{content}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {hasActiveEditor
                            ? 'Finish editing before opening game sessions.'
                            : 'Add at least one question to each question tile before opening game sessions.'}
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return (
                    <Tooltip key={session.id}>
                      <TooltipTrigger asChild>
                        <Link to={`/games/${session.id}/play`} className="rounded-xl">
                          {content}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Continue session</TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
        ) : (
          <p className="mt-2 text-sm italic text-muted-foreground">No sessions yet — start your first game above</p>
        )}
      </div>
    </article>
  )
}

export default BoardInfoCard
