import { Alert02Icon } from '@hugeicons/core-free-icons'
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

function DeleteQuestionTileDialog({ tile, isDeleting, onCancel, onConfirm }) {
  const tileName = tile?.name ?? 'this question tile'

  return (
    <AlertDialog
      open={Boolean(tile)}
      onOpenChange={(open) => {
        if (!open) {
          onCancel()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Icon icon={Alert02Icon} />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete question tile?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block font-medium">
              This <strong className="text-destructive">permanently</strong> removes &quot;{tileName}&quot; and all questions inside it.
            </span>
            <span className="block text-muted-foreground">
              If this tile is used in a board layout, remove it from that board before deleting it here.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete tile'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteQuestionTileDialog
