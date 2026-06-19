import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/components/ui/dialog'

function BoardSelectorDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader className="">
          <DialogTitle>
            Board Selector
          </DialogTitle>
          <DialogDescription>
            Select the board you want to use for this game session.
          </DialogDescription>
        </DialogHeader>

        <div className="">
          board list
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BoardSelectorDialog
