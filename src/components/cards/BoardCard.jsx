import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { Skeleton } from "@/components/ui/skeleton"
import BoardLayoutPreview from '@/components/game/BoardLayoutPreview'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/Icon'
import { Alert02Icon, ArrowDown01Icon, Delete02Icon, PlayCircleIcon } from '@hugeicons/core-free-icons'
import useAppNavigation from '@/hooks/useAppNavigation.hook'
import { deleteBoardById } from '@/services/boards'

function BoardCard({
  board = null,
  isLoading = false,
  onDeleted,
}) {
  const { goTo } = useAppNavigation()
  const location = useLocation()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const title = board?.name ?? "Unknown Board"
  const questionCount = board?.questionCount ?? 0
  const questionBadgeVariant = questionCount === 0 ? 'destructive' : 'secondary'
  const layoutRows = (board?.layout ?? [])//.slice(0, 8)

  const handleDeleteBoard = async () => {
    try {
      setIsDeleting(true)
      await deleteBoardById({ boardId: board?.id })
      setIsDeleteDialogOpen(false)
      toast.success('Board deleted.')
      if (typeof onDeleted === 'function') {
        onDeleted(board?.id)
      }
    } catch (error) {
      toast.error(error?.message ?? 'Could not delete board.')
    } finally {
      setIsDeleting(false)
    }
  }



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
              variant="outline"
              size="sm"
              className="shrink-0 text-muted-foreground"
              aria-label={`Board actions for ${title}`}
            >
              Actions
              <Icon icon={ArrowDown01Icon} className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={() => goTo(`/games/new/${board?.id}`)}>
              <Icon icon={PlayCircleIcon} className="size-4" />
              Start new game
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => setIsDeleteDialogOpen(true)}>
              <Icon icon={Delete02Icon} className="size-4" />
              Delete board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setIsDeleteDialogOpen(false)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Icon icon={Alert02Icon} />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete &quot;{title}&quot; and all related data?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <span className="block text-muted-foreground">
                All linked game sessions, answers, and cascade-related records will be removed automatically.
              </span>
              <span className="block font-semibold text-destructive">
                This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(event) => {
                event.preventDefault()
                handleDeleteBoard()
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete board'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  )
}

export default BoardCard
