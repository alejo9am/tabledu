import { Link, useLocation } from 'react-router-dom'
import { Skeleton } from "@/components/ui/skeleton"
import BoardLayoutPreview from '@/components/game/BoardLayoutPreview'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/Icon'
import { MoreHorizontalCircle01Icon } from '@hugeicons/core-free-icons'

function BoardCard({
  board = null,
  isLoading = false,
}) {
  const location = useLocation()

  const title = board?.name ?? "Unknown Board"
  const questionCount = board?.questionCount ?? 0
  const questionBadgeVariant = questionCount === 0 ? 'destructive' : 'secondary'
  const layoutRows = (board?.layout ?? [])//.slice(0, 8)



  if (isLoading) {
    return <Skeleton className="h-56 rounded-xl animate-in fade-in" />
  }

  return (
    <article className="flex w-full flex-col rounded-xl border bg-card animate-in fade-in">
      <Link
        to={`/boards/${board?.id}`}
        state={{ from: location.pathname }}
        className="flex items-center justify-center overflow-hidden rounded-t-xl border-b border-border bg-muted p-5 transition-opacity hover:opacity-90"
        aria-label={`Open ${title} details`}
      >
        <BoardLayoutPreview layout={layoutRows} />
      </Link>

      <div className="flex items-start justify-between gap-3 p-5">
        <Link
          to={`/boards/${board?.id}`}
          state={{ from: location.pathname }}
          aria-label={`Open ${title} details`}
        >
          <p className="truncate font-display text-3xl font-semibold leading-tight text-primary">{title}</p>
          <Badge variant={questionBadgeVariant} className="mt-3 mx-0 text-sm">
            {questionCount} question{questionCount === 1 ? '' : 's'}
          </Badge>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground"
              aria-label={`Board actions for ${title}`}
            >
              <Icon icon={MoreHorizontalCircle01Icon} className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>
              Start new game
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              Delete board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  )
}

export default BoardCard
