import { useState } from 'react'
import CategoryTile from '@/components/game/CategoryTile'
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
import CategoryIconPickerDialog from '@/features/boards/routes/BoardCreate/components/CategoryIconPickerDialog'

function CreateQuestionTileSheet({
  open,
  name,
  icon,
  description,
  onOpenChange,
  onNameChange,
  onIconChange,
  onDescriptionChange,
  onCreate,
}) {
  const [isIconDialogOpen, setIsIconDialogOpen] = useState(false)

  const previewTile = {
    id: null,
    type: 'question',
    name: name || 'Tile',
    icon: icon || '',
    description: '',
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create question tile</SheetTitle>
          <SheetDescription>
            Create the tile now and add its questions later. Teams will answer from this bank when they land on the tile during gameplay.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 px-6 pb-2">
          <div className="flex flex-col items-center gap-2">
            <Label className="self-start">Tile icon</Label>
            <button
              type="button"
              onClick={() => setIsIconDialogOpen(true)}
              className="w-fit rounded-xl transition hover:opacity-90"
              aria-label="Choose tile icon"
            >
              <CategoryTile category={previewTile} showShadow={false} className="size-20" />
            </button>
            <p className="w-3/4 text-xs text-muted-foreground text-center">
              Choose an icon, or use the first letter of the tile name as the icon
            </p>
          </div>

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

      <CategoryIconPickerDialog
        open={isIconDialogOpen}
        onOpenChange={setIsIconDialogOpen}
        value={icon}
        tileName={name || 'Tile'}
        tileType="question"
        onSelect={onIconChange}
      />
    </>
  )
}

export default CreateQuestionTileSheet
