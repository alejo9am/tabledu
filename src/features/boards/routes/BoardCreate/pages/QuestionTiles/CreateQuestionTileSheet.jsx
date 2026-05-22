import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

function CreateQuestionTileSheet({
  open,
  name,
  description,
  onOpenChange,
  onNameChange,
  onDescriptionChange,
  onCreate,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create question tile</SheetTitle>
          <SheetDescription>
            Create the tile now and add its questions later. Teams will answer from this bank when they land on the tile during gameplay.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 px-6 pb-2">
          <div className="grid gap-2">
            <Label htmlFor="create-question-tile-name">Tile name</Label>
            <Input
              id="create-question-tile-name"
              value={name}
              placeholder="e.g. Roman Empire"
              onChange={(event) => onNameChange(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-question-tile-description">Description</Label>
            <Textarea
              id="create-question-tile-description"
              value={description}
              placeholder="Write the prompt shown before teams answer"
              onChange={(event) => onDescriptionChange(event.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              This description is shown in gameplay before the question appears.
            </p>
          </div>

        </div>

        <SheetFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onCreate}>
            Create tile
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default CreateQuestionTileSheet
