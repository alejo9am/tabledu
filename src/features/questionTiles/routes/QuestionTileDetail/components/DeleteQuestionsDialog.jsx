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

function DeleteQuestionsDialog({ questionIds, isDeleting, onCancel, onConfirm }) {
  const count = questionIds.length
  const open = count > 0

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Icon icon={Alert02Icon} />
          </AlertDialogMedia>
          <AlertDialogTitle>{count === 1 ? 'Delete question?' : 'Delete selected questions?'}</AlertDialogTitle>
          <AlertDialogDescription>
            This <strong className="text-destructive">permanently</strong> removes {count} {count === 1 ? 'question' : 'questions'}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : count === 1 ? 'Delete question' : 'Delete selected'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteQuestionsDialog
