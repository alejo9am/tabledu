import { useState } from 'react'
import { toast } from 'sonner'
import { Delete02Icon, Loading02Icon } from '@hugeicons/core-free-icons'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
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
import { deleteGameById } from '@/services/games'

function GameCard({ game = null, onDeleted }) {
  const location = useLocation()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const title = game?.boardName ?? 'Unknown board'
  const progressPercent = game?.progressPercent ?? 0
  const lastPlayedDiff = game?.lastPlayedDiff ?? 'No recent updates'
  const lastPlayedTitle = game?.lastPlayedTitle

  const handleDeleteGame = async () => {
    try {
      setIsDeleting(true)
      await deleteGameById({ gameId: game?.id })
      setIsDeleteDialogOpen(false)
      toast.success('Game session deleted.')

      if (typeof onDeleted === 'function') {
        onDeleted(game?.id)
      }
    } catch (error) {
      toast.error(error?.message ?? 'Could not delete game session.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <article className="group relative overflow-hidden rounded-xl border border-primary-200/60 bg-card text-left transition hover:-translate-y-0.5 hover:border-primary-350 animate-in fade-in">
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-1.5">
        <span className="h-full w-1/3 bg-primary" />
        <span className="h-full w-1/3 bg-warning" />
        <span className="h-full w-1/3 bg-destructive" />
      </div>

      <Button
        type="button"
        variant="destructive-soft"
        size="icon-xs"
        className="absolute right-4 top-4 z-10"
        onClick={() => setIsDeleteDialogOpen(true)}
        aria-label={`Delete ${title}`}
      >
        <Icon icon={Delete02Icon} className="size-4" />
      </Button>

      <Link
        to={`/games/${game.id}/play`}
        state={{ from: location.pathname }}
        className="flex w-full cursor-pointer flex-col gap-4 p-5"
        aria-label={`Open ${title} session`}
      >
        <div className="pr-9">
          <p className="truncate font-display text-2xl font-semibold leading-tight text-primary-700">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Last played{' '}
            <span title={lastPlayedTitle} className="font-medium text-foreground">
              {lastPlayedDiff}
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold tracking-widest text-muted-foreground">
            <span>PROGRESS</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </Link>

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
              <Icon icon={Delete02Icon} />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this game session?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <span className="block text-muted-foreground">
                This will remove the session, its teams, and related answers.
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
                handleDeleteGame()
              }}
              disabled={isDeleting}
            >
              {isDeleting ? <Icon icon={Loading02Icon} className="size-4 animate-spin" /> : 'Delete session'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  )
}

export default GameCard
